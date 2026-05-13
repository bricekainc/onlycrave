import axios from 'axios';

export default async function handler(req: any, res: any) {
  const { amount, transactionId } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  try {
    const telegramRes = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      title: "Premium Credits",
      description: `Credits for premium digital content and creator interactions. Ref: ${transactionId}`,
      payload: transactionId,
      provider_token: "",
      currency: "XTR", 
      prices: [{ label: "Stars", amount: amount }]
    });

    res.status(200).json({ invoiceLink: telegramRes.data.result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
}
