import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Wallet as WalletIcon, Plus, History, RefreshCw, IndianRupee, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [processingRecharge, setProcessingRecharge] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getWalletBalance();
      setBalance(data.balance);
      const txData = await paymentService.getMyTransactions();
      setTransactions(txData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch wallet balance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) return;
    
    setProcessingRecharge(true);
    setError('');
    
    try {
      const amountFloat = parseFloat(rechargeAmount);
      // 1. Create Order
      const orderData = await paymentService.createOrder(amountFloat);
      orderData.purpose = 'RECHARGE';
      orderData.amount = amountFloat;

      // 2. Open Razorpay Widget
      paymentService.openRazorpayWidget(
        orderData, 
        user, 
        async (verificationResult) => {
          // Success Callback
          await fetchWallet();
          setRechargeAmount('');
          setProcessingRecharge(false);
          alert(`Successfully added ₹${rechargeAmount} to your wallet!`);
        },
        (err) => {
          // Error Callback
          console.error(err);
          setError('Payment failed or cancelled.');
          setProcessingRecharge(false);
        }
      );
    } catch (err) {
      console.error(err);
      setError('Failed to initiate recharge.');
      setProcessingRecharge(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Wallet</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your funds and pay for rides seamlessly.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-[#171a20] rounded-md p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between space-y-6 sm:space-y-0">
          <div>
            <div className="text-slate-400 font-medium flex items-center mb-2">
              <WalletIcon className="w-5 h-5 mr-2" /> Current Balance
            </div>
            <div className="text-5xl font-extrabold tracking-tight flex items-baseline">
              <span className="text-2xl text-slate-400 mr-1">₹</span>
              {balance.toFixed(2)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full sm:w-auto">
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider mb-2">Quick Recharge</div>
            <form onSubmit={handleRecharge} className="flex space-x-2">
              <div className="relative w-full sm:w-32">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">₹</span>
                <input 
                  type="number" 
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="500" 
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <button 
                type="submit" 
                disabled={processingRecharge || !rechargeAmount}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
              >
                {processingRecharge ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Transaction History Placeholder */}
      <div className="card p-6 border border-slate-200 dark:border-slate-800 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <History className="w-5 h-5 mr-2 text-primary-500" /> Recent Transactions
          </h3>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Transaction history will appear here once you start taking rides or recharging your wallet.
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    tx.transactionType === 'DEDUCTION' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {tx.transactionType === 'DEDUCTION' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {tx.transactionType === 'RECHARGE' ? 'Wallet Top-up' : 
                       tx.transactionType === 'DEDUCTION' ? 'Trip Payment' : 'Trip Earnings'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {tx.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${tx.transactionType === 'DEDUCTION' ? 'text-slate-900 dark:text-white' : 'text-green-600 dark:text-green-400'}`}>
                  {tx.transactionType === 'DEDUCTION' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
