import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Handle both PayHero (M-Pesa) and CoinPayments (Crypto) Webhooks
  const data = req.body;
  let tipDetails = {
    amount: '',
    username: '',
    gateway: '',
    status: ''
  };

  // Logic for M-Pesa (PayHero)
  if (data.status === "Success" && data.external_reference?.startsWith('tip_')) {
    const parts = data.external_reference.split('_');
    tipDetails = {
      amount: `${data.amount} KES`,
      username: parts[1],
      gateway: 'M-Pesa',
      status: 'Confirmed'
    };
  } 
  // Logic for Crypto (CoinPayments)
  else if (data.status >= 100 || data.status === 2) {
    const [uName, type] = (data.custom || "").split('|');
    if (type === 'tip') {
      tipDetails = {
        amount: `${data.amount1} ${data.currency1}`,
        username: uName,
        gateway: 'Crypto',
        status: 'Confirmed'
      };
    }
  }

  // 2. If we have a valid tip, send the email
  if (tipDetails.username) {
    try {
      // Note: This uses standard mail transport. 
      // Ensure your environment variables for SMTP are set in Vercel.
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: '"OnlyCrave System" <system@onlycrave.app>',
        to: 'onlycrave@mail.com',
        subject: `💰 New Tip for @${tipDetails.username}`,
        text: `
          New Tip Received!
          -----------------
          Creator: @${tipDetails.username}
          Amount: ${tipDetails.amount}
          Gateway: ${tipDetails.gateway}
          Time: ${new Date().toLocaleString()}
          Status: ${tipDetails.status}
        `,
      });
    } catch (error) {
      console.error("Email failed:", error);
    }
  }

  // Always respond with 200 to the gateway
  res.status(200).send('IPN Received');
}
