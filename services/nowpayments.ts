export interface NowPaymentsInvoiceOptions {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  ipn_callback_url?: string;
  order_id?: string;
  order_description?: string;
}

export const createInvoice = async (options: NowPaymentsInvoiceOptions) => {
  // SECURITY: Call our own serverless endpoint.
  // We do NOT access process.env.NOWPAYMENTS_API_KEY here anymore.
  
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    headers: {
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
    throw new Error(errorData.message || "Failed to create invoice via secure bridge.");
  }

  return await response.json();
};

export const getPaymentStatus = async (paymentId: string) => {
  // SECURITY: Call our own serverless endpoint.
  const response = await fetch(`/api/payment-status?paymentId=${paymentId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error("Unable to verify payment status.");
  }

  return await response.json();
};