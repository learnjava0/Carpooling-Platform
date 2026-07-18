import { Car, Leaf, Route, WalletCards } from "lucide-react";
import { MetricCard } from "../../components/MetricCard";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Live Mobility Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Monitor employees, active trips, savings, and booking health.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Trips" value="24" detail="6 starting in 15 min" icon={<Route size={18} />} />
        <MetricCard label="Completed Trips" value="1,284" detail="Current quarter" icon={<Car size={18} />} />
        <MetricCard label="Revenue" value="₹84,250" detail="Wallet and Razorpay" icon={<WalletCards size={18} />} />
        <MetricCard label="CO2 Saved" value="3.8t" detail="Estimated from shared seats" icon={<Leaf size={18} />} />
      </div>
      <section className="rounded-md border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-ink">Priority Workflows</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {["Ride matching queue", "Live driver tracking", "Payment reconciliation"].map((item) => (
            <div key={item} className="rounded-md border border-line bg-panel p-4">
              <p className="font-medium text-ink">{item}</p>
              <p className="mt-1 text-sm text-slate-600">Ready for API integration in the next backend slice.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

