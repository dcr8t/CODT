export interface NowPaymentsInvoiceOptions {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url?: string;
  order_id?: string;
  order_description?: string;
}

export const createInvoice = async (options: NowPaymentsInvoiceOptions) => {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  
  if (!apiKey) {
    throw new Error("NOWPAYMENTS_API_KEY is missing in environment variables.");
  }

  const response = await fetch('https://api.nowpayments.io/v1/invoice', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...options,
      success_url: window.location.origin + '/#/profile?payment=success',
      cancel_url: window.location.origin + '/#/profile?payment=cancel',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create NOWPayments invoice.");
  }

  return await response.json();
};

export const getPaymentStatus = async (paymentId: string) => {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  
  const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
  });

  return await response.json();
};