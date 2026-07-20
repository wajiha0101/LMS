const paymentsService = require("./payments.service");
const { stripe } = require("../../lib/stripe");

async function checkout(req, res, next) {
  try {
    const studentId = req.user.id;
    const intents = await paymentsService.createCheckout(studentId);
    res.status(201).json({ success: true, data: intents });
  } catch (err) {
    next(err);
  }
}

// This handler receives the RAW body (not JSON-parsed) — see Step 8, app.js wiring.
async function stripeWebhook(req, res, next) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  try {
    await paymentsService.handleStripeWebhook(event);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { checkout, stripeWebhook };