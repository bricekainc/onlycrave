import axios from 'axios';

export default async function handler(req: any, res: any) {
  const { amount, transactionId } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  try {
    const telegramRes = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        title: "OC Premium Credits",
        description: "Credits for premium digital content and creator interactions.",
        payload: String(transactionId),

        provider_token: "",
        currency: "XTR",

        prices: [
          {
            label: "Premium Credits",
            amount: Number(amount)
          }
        ]
      }
    );

    if (!telegramRes.data.ok) {
      return res.status(400).json({
        error: telegramRes.data.description
      });
    }

    return res.status(200).json({
      invoiceLink: telegramRes.data.result
    });

  } catch (error: any) {
    console.error(
      error.response?.data || error.message
    );

    return res.status(500).json({
      error:
        error.response?.data?.description ||
        error.message ||
        "Failed to create invoice"
    });
  }
}
