const { prisma } = require("../../lib/prisma");

function sanitizePayout(payout) {
  return {
    id: payout.id,
    instructorId: payout.instructorId,
    amount: payout.amount,
    periodStart: payout.periodStart,
    periodEnd: payout.periodEnd,
    status: payout.status,
    stripeTransferId: payout.stripeTransferId,
    createdAt: payout.createdAt,
  };
}

function sanitizePayoutWithInstructor(payout) {
  return {
    ...sanitizePayout(payout),
    instructor: {
      name: payout.instructor.name,
      email: payout.instructor.email,
    },
  };
}

async function listOwnPayouts(instructorId) {
  const payouts = await prisma.payout.findMany({
    where: { instructorId: instructorId },
    orderBy: { createdAt: "desc" },
  });

  return payouts.map(sanitizePayout);
}

async function listAllPayouts() {
  const payouts = await prisma.payout.findMany({
    include: { instructor: true },
    orderBy: { createdAt: "desc" },
  });

  return payouts.map(sanitizePayoutWithInstructor);
}

module.exports = { listOwnPayouts, listAllPayouts };
