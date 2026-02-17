import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'Server Payment Configuration Missing' });
  }

  try {
    const npResponse = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });

    const data = await npResponse.json();

    if (!npResponse.ok) {
      return response.status(npResponse.status).json(data);
    }

    return response.status(200).json(data);
  } catch (error: any) {
    return response.status(500).json({ error: error.message || 'Payment Gateway Error' });
  }
}