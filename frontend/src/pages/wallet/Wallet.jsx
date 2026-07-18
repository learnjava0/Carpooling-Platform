import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, ArrowDownRight, ArrowUpRight, QrCode, AlertCircle, RefreshCw, Smartphone, Building2, TrendingUp, Download, CheckCircle2 } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { getWallet, getTransactions, rechargeWallet } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return isoString; }
}

const TX_META = {
  RECHARGE: { icon: ArrowDownRight, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', sign: '+', label: 'Wallet Top-up' },
  DEDUCTION: { icon: ArrowUpRight, color: 'text-destructive', bg: 'bg-destructive/10', sign: '−', label: 'Ride Payment' },
  EARNING:   { icon: ArrowDownRight, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', sign: '+', label: 'Ride Earning' },
};

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [w, t] = await Promise.all([getWallet(), getTransactions()]);
      setWallet(w);
      setTxns(t);
    } catch (err) {
      // Mock data
      setWallet({ balance: 2450.50 });
      setTxns([
        { id: 'TXN-9901', transactionType: 'DEDUCTION', amount: 45.00, createdAt: new Date().toISOString(), paymentMethod: 'Corporate Wallet', tripId: 'TRP-1093' },
        { id: 'TXN-9902', transactionType: 'EARNING', amount: 120.00, createdAt: new Date(Date.now() - 86400000).toISOString(), paymentMethod: 'Direct Deposit', tripId: 'TRP-1092' },
        { id: 'TXN-9903', transactionType: 'RECHARGE', amount: 1500.00, createdAt: new Date(Date.now() - 172800000).toISOString(), paymentMethod: 'Auto-Debit (HR)' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <AppShell title="Payments & Billing">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Finances & Wallet</h2>
          <p className="text-muted-foreground text-sm">Manage enterprise payment methods, track spending, and review invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Tax Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Balance Card */}
          <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-lg">
             <div className="absolute top-0 right-0 p-6 opacity-20 hover:opacity-40 transition-opacity">
               <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
             </div>
             
             <CardHeader className="pb-2">
               <CardDescription className="text-primary-foreground/70 uppercase tracking-wider font-bold text-[10px]">Coporate Allowance Balance</CardDescription>
               <div className="flex items-baseline gap-1 mt-1">
                 <span className="text-2xl font-medium opacity-80">₹</span>
                 <span className="text-5xl font-black tracking-tighter">{loading ? '---' : wallet?.balance.toFixed(2)}</span>
               </div>
             </CardHeader>
             
             <CardContent className="pb-6">
               <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mt-2">
                 <RefreshCw className="w-3 h-3" /> Auto-recharge set for 1st of every month
               </div>
             </CardContent>
             
             <CardFooter className="bg-black/10 backdrop-blur-sm border-t border-white/10 p-4 gap-3">
               <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-sm">
                 <Plus className="w-4 h-4 mr-2" /> Top Up
               </Button>
               <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                 <QrCode className="w-4 h-4 mr-2" /> Scan to Pay
               </Button>
             </CardFooter>
          </Card>

          {/* Payment Methods */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center justify-between">
                Payment Methods
                <Button variant="link" className="h-auto p-0 text-xs">Add New</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="p-4 flex items-center gap-4 hover:bg-muted/30 cursor-pointer transition-colors bg-muted/10 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">Enterprise Wallet</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Primary Method · HR Managed</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                
                <div className="p-4 flex items-center gap-4 hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">Corporate Credit Card</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">**** **** **** 4910</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-center gap-4 hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">UPI Linked</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">user@corphub</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="h-full shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your ride payments and enterprise wallet recharges</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={loadData} disabled={loading} className="shrink-0 h-8 w-8">
                <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center h-64 opacity-50">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Syncing transaction history...</p>
                </div>
              ) : txns.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center h-64">
                  <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h4 className="font-medium text-lg mb-1">No Transactions</h4>
                  <p className="text-sm text-muted-foreground">Your recent financial activity will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {txns.map(tx => {
                    const meta = TX_META[tx.transactionType] || TX_META.DEDUCTION;
                    const Icon = meta.icon;
                    return (
                      <div key={tx.id} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.color} shadow-sm group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-sm sm:text-base font-bold text-foreground truncate mr-2">
                              {tx.transactionType === 'DEDUCTION' && tx.tripId ? `Ride Payment ${tx.tripId}` : meta.label}
                            </h4>
                            <span className={`text-sm sm:text-base font-black tracking-tight shrink-0 ${meta.color}`}>
                              {meta.sign}₹{tx.amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground font-medium">
                            <span>{formatDate(tx.createdAt)}</span>
                            <span>{tx.paymentMethod}</span>
                          </div>
                          
                          {/* Expanded detail placeholder */}
                          {tx.transactionType === 'DEDUCTION' && (
                            <div className="mt-2 text-xs flex gap-2 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto transition-all">
                               <Badge variant="outline" className="text-[9px] font-bold h-5 shadow-sm">View Invoice</Badge>
                               <Badge variant="outline" className="text-[9px] font-bold h-5 shadow-sm">Report Issue</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-4 border-t border-border flex justify-center bg-muted/10">
               <Button variant="ghost" className="w-full text-sm font-semibold hover:bg-muted">View Entire Statement</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
