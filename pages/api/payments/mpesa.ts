import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * PAYHERO MPESA GATEWAY HANDLER
 * Required Environment Variables in Vercel:
 * - PAYHERO_API_USERNAME
 * - PAYHERO_API_PASSWORD
 * - PAYHERO_CHANNEL_ID
 * - WEBAPP_URL (e.g., https://onlycrave.vercel.app)
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, phone, username } = req.body;

  // 1. Validation
  if (!amount || !phone || !username) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // 2. Setup Authentication for PayHero
  const PAYHERO_USER = process.env.PAYHERO_API_USERNAME;
  const PAYHERO_PASS = process.env.PAYHERO_API_PASSWORD;
  const auth = Buffer.from(`${PAYHERO_USER}:${PAYHERO_PASS}`).toString('base64');

  try {
    // 3. Request STK Push from PayHero
    // Note: We multiply by 129.5 to convert USD to KES for the local gateway
    const response = await axios.post('https://backend.payhero.co.ke/api/v2/payments', {
      amount: Math.round(Number(amount) * 129.5), 
      phone_number: phone.replace('+', ''), // Ensure no '+' sign
      channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
      provider: 'm-pesa',
      external_reference: `tip_${username}_${Date.now()}`,
      callback_url: `${process.env.WEBAPP_URL}/api/payments/callback`
    }, { 
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      } 
    });

    // 4. Handle Response
    if (response.data.success || response.data.status === 'QUEUED') {
      return res.status(200).json({ success: true, message: 'STK Push Sent' });
    }
    
    return res.status(400).json({ success: false, error: 'Gateway rejected the request' });

  } catch (error: any) {
    console.error("PayHero Error:", error.response?.data || error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to initiate M-Pesa payment' 
    });
  }
}
