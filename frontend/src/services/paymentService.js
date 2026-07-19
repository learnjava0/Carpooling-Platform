import api from './api';

export const paymentService = {
  createOrder: async (amount) => {
    const response = await api.post(`/payments/create-order?amount=${amount}`);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify-razorpay', paymentData);
    return response.data;
  },

  getWalletBalance: async () => {
    const response = await api.get('/payments/wallet');
    return response.data;
  },

  rechargeWallet: async (amount) => {
    // This is the direct backend recharge bypass for now if needed, but Razorpay is preferred.
    const response = await api.post('/payments/wallet/recharge', { amount, paymentMethod: 'CARD' });
    return response.data;
  },

  payForTrip: async (tripId, paymentMethod) => {
    const response = await api.post('/payments/trip/pay', { tripId, paymentMethod });
    return response.data;
  },

  getMyTransactions: async () => {
    const response = await api.get('/payments/transactions');
    return response.data;
  },

  logFailedPayment: async (paymentData) => {
    try {
      await api.post('/payments/log-failure', paymentData);
    } catch (e) {
      console.error('Failed to log payment failure', e);
    }
  },

  openRazorpayWidget: (orderData, user, onSuccess, onError) => {
    let paymentSuccess = false;

    const options = {
      key: 'rzp_test_TEtkcWeUnkc6xQ', // Provided Razorpay Key
      amount: Math.round(orderData.amount * 100), // Razorpay expects amount in paise
      currency: orderData.currency,
      name: 'RideConnect Carpooling',
      description: 'Trip Payment',
      order_id: orderData.razorpayOrderId,
      handler: async function (response) {
        paymentSuccess = true;
        try {
          const verificationResult = await paymentService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            tripId: orderData.tripId,
            purpose: orderData.purpose,
            amount: orderData.amount,
            paymentMethod: 'RAZORPAY'
          });
          onSuccess(verificationResult);
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        contact: user.phoneNumber || '9999999999'
      },
      theme: {
        color: '#0ea5e9' // Primary color
      },
      modal: {
        ondismiss: function() {
          if (!paymentSuccess) {
            paymentService.logFailedPayment({ amount: orderData.amount, paymentMethod: 'RAZORPAY', purpose: orderData.purpose, tripId: orderData.tripId });
            onError(new Error('Payment window closed by user'));
          }
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      paymentService.logFailedPayment({ amount: orderData.amount, paymentMethod: 'RAZORPAY', purpose: orderData.purpose, tripId: orderData.tripId });
      onError(response.error);
    });
    rzp.open();
  }
};
