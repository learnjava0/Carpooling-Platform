import { Plus, CreditCard, ArrowDownRight, ArrowUpRight, QrCode, IndianRupee } from 'lucide-react';
import AppShell from '../../layouts/AppShell';

const transactions = [
  { id: 1, type: 'credit', amount: 500, desc: 'Wallet Recharge via UPI', date: '18 Jul 2026, 10:30 AM' },
  { id: 2, type: 'debit',  amount: 120, desc: 'Ride: ISKCON → Infinity', date: '17 Jul 2026, 09:00 AM' },
  { id: 3, type: 'credit', amount: 240, desc: 'Ride Earnings (2 Passengers)', date: '16 Jul 2026, 06:15 PM' },
  { id: 4, type: 'debit',  amount: 120, desc: 'Ride: ISKCON → Abbey', date: '15 Jul 2026, 04:00 AM' },
];

export default function Wallet() {
  return (
    <AppShell title="Wallet">
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left column */}
        <div>
          <div className="wallet-balance-card" style={{ marginBottom: 16 }}>
            <p className="wallet-label">Current Balance</p>
            <p className="wallet-amount">₹ 120</p>
            <div className="wallet-actions">
              <button className="btn btn-primary"><Plus size={15} /> Add Money</button>
              <button className="btn btn-ghost"><QrCode size={15} /> Scan / Pay</button>
            </div>
          </div>

          <div className="card">
            <p className="section-label">Payment Methods</p>
            <div className="stack">
              {[
                { label: 'UPI Payment', sub: '@ABCD', icon: QrCode },
                { label: 'Card Payment', sub: '**** 5678', icon: CreditCard },
                { label: 'Wallet Balance', sub: '₹120 available', icon: IndianRupee },
              ].map(m => (
                <label key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', background: 'var(--bg-elevated)', borderRadius: 10, cursor: 'pointer' }}>
                  <input type="radio" name="payment" style={{ accentColor: 'var(--brand)', width: 15, height: 15 }} />
                  <m.icon size={15} color="var(--text-2)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{m.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — transactions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Transaction History</span>
            <span className="badge badge-muted">{transactions.length} entries</span>
          </div>

          {transactions.map(tx => (
            <div key={tx.id} className="tx-item">
              <div className={`tx-icon ${tx.type === 'credit' ? 'tx-icon-credit' : 'tx-icon-debit'}`}>
                {tx.type === 'credit' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-desc">{tx.desc}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div className={`tx-amount ${tx.type === 'credit' ? 'tx-amount-credit' : 'tx-amount-debit'}`}>
                {tx.type === 'credit' ? '+' : '−'}₹{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
