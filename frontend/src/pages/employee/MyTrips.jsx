import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { paymentService } from '../../services/paymentService';
import { rideService } from '../../services/rideService';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Clock, CreditCard, CheckCircle2, AlertCircle, RefreshCw, Car, User } from 'lucide-react';

const MyTrips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('passenger');
  const [trips, setTrips] = useState([]);
  const [hostedRides, setHostedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState({ tripId: null, status: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const passengerTrips = await tripService.getMyTrips();
      setTrips(passengerTrips);
      
      const driverRides = await rideService.getDriverRides();
      setHostedRides(driverRides.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED'));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayment = async (trip) => {
    setPaymentStatus({ tripId: trip.id, status: 'processing', message: '' });
    try {
      const amountToPay = trip.totalFare || trip.ride?.farePerSeat || 0;
      const orderData = await paymentService.createOrder(amountToPay);
      orderData.purpose = 'TRIP';
      orderData.tripId = trip.id;
      
      paymentService.openRazorpayWidget(
        orderData, 
        user, 
        (successResult) => {
          setPaymentStatus({ tripId: trip.id, status: 'success', message: 'Payment successful!' });
          fetchData(); // Refresh to update status
        },
        (errorResult) => {
          setPaymentStatus({ tripId: trip.id, status: 'error', message: 'Payment failed or was cancelled.' });
        }
      );
    } catch (err) {
      setPaymentStatus({ tripId: trip.id, status: 'error', message: 'Failed to initialize payment.' });
    }
  };

  const handleOfflinePayment = async (tripId, method) => {
    setPaymentStatus({ tripId, status: 'processing', message: '' });
    try {
      await paymentService.payForTrip(tripId, method);
      setPaymentStatus({ tripId, status: 'success', message: `Successfully paid via ${method}!` });
      fetchData();
    } catch (err) {
      setPaymentStatus({ tripId, status: 'error', message: err.response?.data?.message || `Failed to process ${method} payment.` });
    }
  };

  const handleWalletPayment = async (trip) => {
    setPaymentStatus({ tripId: trip.id, status: 'processing', message: 'Checking wallet balance...' });
    try {
      const wallet = await paymentService.getWalletBalance();
      const amountToPay = trip.totalFare || trip.ride?.farePerSeat || 0;
      
      if (wallet.balance < amountToPay) {
        const missingAmount = amountToPay - wallet.balance;
        setPaymentStatus({ tripId: trip.id, status: 'processing', message: `Insufficient balance. Adding ₹${missingAmount.toFixed(2)} via Razorpay...` });
        
        const orderData = await paymentService.createOrder(missingAmount);
        orderData.purpose = 'RECHARGE';
        orderData.amount = missingAmount;
        
        paymentService.openRazorpayWidget(
          orderData, 
          user, 
          async () => {
             // Recharge successful, now pay!
             setPaymentStatus({ tripId: trip.id, status: 'processing', message: 'Wallet recharged. Paying for trip...' });
             await handleOfflinePayment(trip.id, 'WALLET');
          },
          (err) => {
             setPaymentStatus({ tripId: trip.id, status: 'error', message: 'Wallet recharge cancelled.' });
          }
        );
      } else {
        await handleOfflinePayment(trip.id, 'WALLET');
      }
    } catch (err) {
       setPaymentStatus({ tripId: trip.id, status: 'error', message: 'Failed to process wallet payment.' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trips & Rides</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your upcoming rides, past payments, and hosted journeys.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('passenger')}
          className={`flex items-center pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'passenger' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-4 h-4 mr-2" /> Rides Taken
        </button>
        <button
          onClick={() => setActiveTab('driver')}
          className={`flex items-center pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'driver' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Car className="w-4 h-4 mr-2" /> Rides Hosted
        </button>
      </div>

      {activeTab === 'passenger' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map(trip => (
            <div key={trip.id} className="card p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Host: {trip.ride?.driver?.firstName}</div>
                <div className="text-sm font-medium mt-1">
                  Status: 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    trip.status === 'STARTED' ? 'bg-indigo-100 text-indigo-700' :
                    trip.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                    trip.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    trip.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    trip.status === 'BOOKED' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{trip.ride?.farePerSeat}</div>
                {(trip.status === 'ACCEPTED' || trip.status === 'PENDING') && trip.startOtp && (
                  <div className="mt-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    OTP: {trip.startOtp}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-800"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{trip.ride?.pickupLocation}</div>
                    <div className="text-xs text-slate-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" /> {new Date(trip.ride?.departureTime).toLocaleDateString()} {new Date(trip.ride?.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{trip.ride?.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            {paymentStatus.tripId === trip.id && paymentStatus.message && (
              <div className={`mb-4 p-3 rounded-lg text-sm flex items-start space-x-2 ${paymentStatus.status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {paymentStatus.status === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{paymentStatus.message}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
              {trip.status === 'PAYMENT_COMPLETED' ? (
                <div className="flex justify-center items-center text-green-600 font-medium py-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Paid
                </div>
              ) : trip.status === 'COMPLETED' ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Select Payment Method</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={() => handleWalletPayment(trip)} className="border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Wallet</button>
                    <button onClick={() => handleOfflinePayment(trip.id, 'UPI')} className="border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">UPI</button>
                    <button onClick={() => handlePayment(trip)} className="border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition text-primary-600">Card (Razorpay)</button>
                    <button onClick={() => handleOfflinePayment(trip.id, 'CASH')} className="border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cash</button>
                  </div>
                </div>
              ) : (trip.status === 'STARTED' || trip.status === 'ACCEPTED') ? (
                <button 
                  onClick={() => navigate('/employee/track', { state: { trip } })}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-lg flex justify-center items-center transition-colors font-medium text-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Track Ride
                </button>
              ) : (trip.status === 'BOOKED' || trip.status === 'PENDING') ? (
                <button 
                  onClick={async () => {
                    if(window.confirm('Are you sure you want to cancel this trip?')) {
                      try {
                        await tripService.cancelTrip(trip.id);
                        fetchData();
                      } catch (err) {
                        alert('Failed to cancel trip.');
                      }
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg flex justify-center items-center transition-colors font-medium text-sm"
                >
                  Cancel Trip
                </button>
              ) : trip.status === 'STARTED' ? (
                <button 
                  onClick={() => navigate('/employee/track', { state: { trip } })}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-lg flex justify-center items-center transition-colors font-medium text-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Track Trip
                </button>
              ) : trip.status === 'CANCELLED' ? (
                 <div className="text-center text-sm text-red-500 py-2 font-medium">
                  Trip Cancelled
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-2">
                  Payment unlocks after trip completion
                </div>
              )}
            </div>
          </div>
        ))}

          {trips.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 card border-dashed">
              <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>You haven't booked any trips yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'driver' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostedRides.map(ride => (
            <div key={ride.id} className="card p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Route: {ride.pickupLocation} to {ride.destination}</div>
                  <div className="text-sm font-medium mt-1">
                    Status: <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{ride.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{ride.farePerSeat}</div>
                </div>
              </div>
              <div className="flex-1 space-y-4 mb-6">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Completed on: {new Date(ride.departureTime).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-500">
                  Total Seats: {ride.totalSeats} | Passengers: {ride.trips?.length || 0}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto text-center text-sm text-green-600 font-medium flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Hosted Successfully
              </div>
            </div>
          ))}

          {hostedRides.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 card border-dashed">
              <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>You haven't completed any hosted rides yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
