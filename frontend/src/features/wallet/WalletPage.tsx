export function WalletPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="rounded-md border border-line bg-white p-5">
        <p className="text-sm font-medium text-slate-600">Wallet Balance</p>
        <p className="mt-3 text-3xl font-semibold text-ink">₹2,840</p>
        <button className="focus-ring mt-5 h-10 w-full rounded-md bg-brand px-4 text-sm font-semibold text-white">
          Recharge
        </button>
      </section>
      <section className="rounded-md border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Transactions</h2>
        <div className="mt-4 divide-y divide-line">
          {["Ride payment", "Wallet recharge", "Refund"].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 text-sm">
              <span className="font-medium text-ink">{item}</span>
              <span className="text-slate-600">₹240</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

