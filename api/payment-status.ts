import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const { paymentId } = request.query;

  if (!apiKey) {
    return response.status(500).json({ error: 'Server Payment Configuration Missing' });
  }

  if (!paymentId) {
    return response.status(400).json({ error: 'Payment ID required' });
  }

  try {
    const npResponse = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    const data = await npResponse.json();
    return response.status(npResponse.status).json(data);
  } catch (error: any) {
    return response.status(500).json({ error: error.message || 'Status Check Failed' });
  }
}