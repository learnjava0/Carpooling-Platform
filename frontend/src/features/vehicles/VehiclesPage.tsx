export function VehiclesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-ink">My Vehicles</h2>
        <button className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Add Vehicle</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {["KA 03 MX 4821", "KA 05 EV 1188", "KA 01 CN 9012"].map((plate) => (
          <article key={plate} className="rounded-md border border-line bg-white p-4">
            <p className="font-semibold text-ink">{plate}</p>
            <p className="mt-1 text-sm text-slate-600">Verified · 4 seats · AC</p>
          </article>
        ))}
      </div>
    </div>
  );
}

