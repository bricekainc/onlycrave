import axios from 'axios';

export default async function handler(req: any, res: any) {
  const { amount, transactionId } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  try {
    const telegramRes = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      title: "Premium Credits",
      description: `Digital Access Credits Ref: ${transactionId}`,
      payload: transactionId, // This is returned to you after payment
      provider_token: "",     // Empty for Telegram Stars
      currency: "XTR",        // XTR is the code for Stars
      prices: [{ label: "Stars", amount: amount }] // amount is an integer
    });

    res.status(200).json({ invoiceLink: telegramRes.data.result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
}
