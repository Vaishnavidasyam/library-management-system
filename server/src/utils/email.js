import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 2525),
  auth: process.env.EMAIL_USER ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } : undefined
});

export const sendMail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_HOST || !to) return;
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};
