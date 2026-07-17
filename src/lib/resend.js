const { Resend } = require("resend");

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

async function sendPasswordResetEmail(email, code) {
  const resend = getResendClient();

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your password reset code",
    text: `Your password reset code is ${code}. It expires in 15 minutes.`,
  });
}

module.exports = { sendPasswordResetEmail };
