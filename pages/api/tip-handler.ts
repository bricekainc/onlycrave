import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { method, amount, phone, username } = req.body;
  const KES_RATE = 130; // Better to fetch dynamically, but hardcoded for safety

  try {
    if (method === 'mpesa') {
      const auth = Buffer.from(`${process.env.PAYHERO_API_USERNAME}:${process.env.PAYHERO_API_PASSWORD}`).toString('base64');
      
      const response = await axios.post('https://backend.payhero.co.ke/api/v2/payments', {
        amount: Math.round(Number(amount) * KES_RATE),
        phone_number: phone,
        channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
        provider: 'm-pesa',
        external_reference: `tip_${username}_${Date.now()}`,
        callback_url: `${process.env.WEBAPP_URL}/api/callback`
      }, { headers: { 'Authorization': `Basic ${auth}` } });

      return res.json({ success: response.data.success });
    }

    if (method === 'crypto') {
      const params = new URLSearchParams({
        cmd: '_pay_simple',
        merchant: process.env.COINPAYMENTS_MERCHANT_ID || '',
        item_name: `Tip for ${username}`,
        amountf: amount,
        currency: 'USD',
        email: 'africka@mail.com',
        first_name: 'Tip',
        last_name: String(username),
        custom: `${username}|tip`,
        success_url: `https://onlycrave.vercel.app/${username}`,
        ipn_url: `${process.env.WEBAPP_URL}/api/callback`
      });
      
      return res.json({ url: `https://www.coinpayments.net/index.php?${params.toString()}` });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
