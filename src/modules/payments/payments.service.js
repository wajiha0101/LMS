const { prisma } = require("../../lib/prisma"); // confirm export shape matches lib/prisma.js
const { stripe } = require("../../lib/stripe");
const { AppError } = require("../../utils/AppError");

const COMMISSION_RATE = 0.2; // placeholder — confirm real rate with the team (Section 12.2), update here

async function createCheckout(studentId) {
  const cartItems = await prisma.cartItem.findMany({
    where: { studentId },
    include: { course: true },
  });

  if (cartItems.length === 0) {
    throw AppError.BadRequest("Cart is empty");
  }

  const intents = [];
  for (const item of cartItems) {
    const amount = Math.round(Number(item.course.price) * 100); // cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { studentId, courseId: item.courseId },
    });

    await prisma.payment.create({
      data: {
        studentId,
        courseId: item.courseId,
        amount: item.course.price,
        commissionAmount: Number(item.course.price) * COMMISSION_RATE,
        currency: "usd",
        stripePaymentIntentId: paymentIntent.id,
        status: "PENDING",
      },
    });

    intents.push({ courseId: item.courseId, clientSecret: paymentIntent.client_secret });
  }

  return intents;
}

async function handleStripeWebhook(event) {
  if (event.type !== "payment_intent.succeeded") return;

  const intent = event.data.object;
  const stripePaymentIntentId = intent.id;

  // Idempotency: only proceed if this Payment is still PENDING (Stripe retries webhook delivery)
  const payment = await prisma.payment.findUnique({ where: { stripePaymentIntentId } });
  if (!payment || payment.status === "SUCCEEDED") {
    return; // already processed, or unknown intent — safe no-op
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { stripePaymentIntentId },
      data: { status: "SUCCEEDED" },
    }),
    prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: payment.studentId, courseId: payment.courseId } },
      update: {},
      create: { studentId: payment.studentId, courseId: payment.courseId },
    }),
    prisma.cartItem.deleteMany({
      where: { studentId: payment.studentId, courseId: payment.courseId },
    }),
  ]);
}

module.exports = { createCheckout, handleStripeWebhook };