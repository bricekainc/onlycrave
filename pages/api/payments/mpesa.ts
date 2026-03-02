import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * PAYHERO MPESA GATEWAY HANDLER
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Method Check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { amount, phone, username } = req.body;

  // 2. Validation
  if (!amount || !phone || !username) {
    return res.status(400).json({ success: false, error: 'Missing required fields: amount, phone, or username' });
  }

  // 3. Environment Variable Safety Check
  const PAYHERO_USER = process.env.PAYHERO_API_USERNAME;
  const PAYHERO_PASS = process.env.PAYHERO_API_PASSWORD;
  const CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID;

  if (!PAYHERO_USER || !PAYHERO_PASS || !CHANNEL_ID) {
    console.error("Missing PayHero Configuration in Environment Variables");
    return res.status(500).json({ success: false, error: 'Payment gateway misconfigured' });
  }

  // 4. Generate Auth Token
  const auth = Buffer.from(`${PAYHERO_USER}:${PAYHERO_PASS}`).toString('base64');

  // 5. Sanitize Phone Number (PayHero expects 254...)
  let sanitizedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
  if (sanitizedPhone.startsWith('0')) {
    sanitizedPhone = '254' + sanitizedPhone.substring(1);
  } else if (sanitizedPhone.startsWith('7') || sanitizedPhone.startsWith('1')) {
    sanitizedPhone = '254' + sanitizedPhone;
  }

  try {
    // 6. Request STK Push
    // Conversion: USD to KES (Using 129.5 as requested)
    const kesAmount = Math.round(Number(amount) * 129.5);

    const response = await axios.post('https://backend.payhero.co.ke/api/v2/payments', {
      amount: kesAmount, 
      phone_number: sanitizedPhone,
      channel_id: Number(CHANNEL_ID),
      provider: 'm-pesa',
      external_reference: `tip_${username.substring(0, 10)}_${Date.now()}`,
      callback_url: `${process.env.WEBAPP_URL || 'https://onlycrave.vercel.app'}/api/payments/callback`
    }, { 
      timeout: 15000, // 15 second timeout for Vercel
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      } 
    });

    // 7. Handle Success
    // PayHero returns success: true or status: "QUEUED" / "SUCCESSFUL"
    if (response.data.success || response.data.status === 'QUEUED' || response.data.status === 'SUCCESSFUL') {
      return res.status(200).json({ 
        success: true, 
        message: 'M-Pesa STK Push initiated successfully',
        reference: response.data.reference 
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      error: response.data.message || 'Gateway rejected the request' 
    });

  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("PayHero API Error:", JSON.stringify(errorData || error.message));
    
    return res.status(500).json({ 
      success: false, 
      error: errorData?.message || 'Failed to connect to M-Pesa gateway' 
    });
  }
}
