import nodemailer from 'nodemailer';

interface SenderContact {
  name: string;
  email: string;
}

async function submitReport(projectId: string, path: string, sender: SenderContact, reason: string, text: string) {
  const subject = `[Report] ${projectId} - ${reason}`;
  const body =
    `Received project report

------------------------ 
From: ${sender.name} <${sender.email}>
Project ID: ${projectId}
Path: ${path}
Reason: ${reason}
------------------------

${text}
`;
  return sendMessage(process.env.SMTP_REPORT_RECEIVER!, subject, body);
}

async function sendMessage(recipient: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT!,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
      timeout: 5000
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_REPORT_SENDER,
    to: recipient,
    subject,
    text: body
  });

  console.log('Message sent: %s', info.messageId);
}

export default {
  submitReport
};
