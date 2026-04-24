import apiWrapper from './apiWrapper';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeRazorpay = async (orderData) => {
  const res = await loadRazorpayScript();
  
  if (!res) {
    throw new Error('Razorpay SDK failed to load. Are you online?');
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    amount: Math.round(orderData.total * 100),
    currency: 'USD',
    name: 'Furniqo',
    description: `Order #${orderData.orderNumber || 'FNQ-XXXX'}`,
    image: '/logo.png',
    order_id: orderData.razorpayOrderId || undefined,
    handler: async (response) => {
      // Verify payment
      try {
        const verifyResponse = await apiWrapper.createOrder({
          ...orderData,
          paymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });
        return verifyResponse.data;
      } catch (error) {
        throw error;
      }
    },
    prefill: {
      name: `${orderData.shipping?.firstName} ${orderData.shipping?.lastName}`,
      email: orderData.shipping?.email,
      contact: orderData.shipping?.phone,
    },
    theme: {
      color: '#9333ea',
    },
    modal: {
      ondismiss: () => {
        console.log('Payment dismissed');
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  
  return new Promise((resolve, reject) => {
    razorpay.on('payment.failed', (response) => {
      reject(new Error(response.error.description || 'Payment failed'));
    });

    razorpay.open();
    
    // Store reference to resolve after handler completes
    razorpay._resolve = resolve;
  });
};

export const processPayment = async (orderData) => {
  try {
    return await initializeRazorpay(orderData);
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};