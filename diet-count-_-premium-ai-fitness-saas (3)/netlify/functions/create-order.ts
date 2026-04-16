import { Handler } from '@netlify/functions';
import Razorpay from 'razorpay';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay keys are missing in Netlify environment variables." }),
      };
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: 4900,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    };
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to create order" }),
    };
  }
};
