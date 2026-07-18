import DashboardLayout from '../../layouts/DashboardLayout';
import { Wallet as WalletIcon, CreditCard, ArrowDownRight, ArrowUpRight, Plus, History } from 'lucide-react';

function Wallet() {
  const transactions = [
    { id: 1, type: 'credit', amount: '₹500', desc: 'Wallet Recharge via UPI', date: '18 Jul 2026, 10:30 AM' },
    { id: 2, type: 'debit', amount: '₹50', desc: 'Ride from Green Valley to Office', date: '17 Jul 2026, 09:00 AM' },
    { id: 3, type: 'credit', amount: '₹150', desc: 'Ride Earnings (3 Passengers)', date: '16 Jul 2026, 06:15 PM' },
  ];

  return (
    <DashboardLayout title="My Wallet">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
        
        {/* Balance Card */}
        <div className="erp-card" style={{ background: 'linear-gradient(135deg, var(--brand), #ffd86f)', color: 'var(--brand-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 600, opacity: 0.9 }}>Current Balance</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900 }}>₹850.00</h2>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
              <WalletIcon size={32} />
            </div>
          </div>
          
          <button className="primary-button" style={{ background: 'var(--brand-dark)', color: '#fff', width: '100%', marginBottom: '12px' }}>
            <Plus size={18} /> Add Money
          </button>
          <button className="secondary-button" style={{ background: 'rgba(255,255,255,0.5)', border: 'none', width: '100%' }}>
            <CreditCard size={18} /> Manage Payment Methods
          </button>
        </div>

        {/* Transactions */}
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} /> Transaction History
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: tx.type === 'credit' ? '#dcfce7' : '#fee2e2', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    {tx.type === 'credit' ? <ArrowDownRight size={20} color="#166534" /> : <ArrowUpRight size={20} color="#991b1b" />}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{tx.desc}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>{tx.date}</p>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: tx.type === 'credit' ? '#166534' : 'var(--text)' }}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Wallet;
