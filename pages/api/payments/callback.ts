import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const data = req.body;
  
  // Logic: PayHero sends "Success" for M-Pesa. CoinPayments uses status >= 100.
  const isMpesaSuccess = data.status === "Success";
  const isCryptoSuccess = parseInt(data.status) >= 100;

  if (isMpesaSuccess || isCryptoSuccess) {
    const reference = data.external_reference || data.custom || "Unknown_Unknown";
    const amount = data.amount || data.amountf;
    const creatorUsername = reference.split('_')[1] || "Creator";

    try {
      // Send Email Notification via Resend
      await resend.emails.send({
        from: 'OnlyCrave Alerts <africka@mail.comm>',
        to: 'africka@mail.com',
        subject: `💰 New Tip: $${amount} for @${creatorUsername}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #111;">
            <h2 style="color: #0102FD;">New Tip Received!</h2>
            <p><strong>Creator:</strong> @${creatorUsername}</p>
            <p><strong>Amount:</strong> USD ${amount}</p>
            <p><strong>Method:</strong> ${isMpesaSuccess ? 'M-Pesa' : 'Crypto'}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">This is an automated notification from OnlyCrave.</p>
          </div>
        `
      });

      console.log(`Email sent for tip to @${creatorUsername}`);
    } catch (err) {
      console.error("Email failed to send:", err);
    }
  }

  // Always return 200 to the payment gateway so they stop retrying
  res.status(200).json({ status: 'received' });
}
