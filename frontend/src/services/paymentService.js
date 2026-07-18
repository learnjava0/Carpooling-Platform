import api from './api';

export const paymentService = {
  createOrder: async (tripId) => {
    const response = await api.post(`/payments/create-order?tripId=${tripId}`);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  getWalletBalance: async () => {
    const response = await api.get('/payments/wallet');
    return response.data;
  },

  rechargeWallet: async (amount) => {
    const response = await api.post('/payments/wallet/recharge', { amount, paymentMethod: 'CARD' });
    return response.data;
  },

  payForTrip: async (tripId, paymentMethod) => {
    const response = await api.post('/payments/trip/pay', { tripId, paymentMethod });
    return response.data;
  },

  openRazorpayWidget: (orderData, user, onSuccess, onError) => {
    const options = {
      key: 'rzp_test_TEtkcWeUnkc6xQ', // Provided Razorpay Key
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'RideConnect Carpooling',
      description: 'Trip Payment',
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const verificationResult = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
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
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      onError(response.error);
    });
    rzp.open();
  }
};
