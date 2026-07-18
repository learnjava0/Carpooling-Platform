export function FindRidePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-md border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Find Ride</h2>
        <div className="mt-5 space-y-4">
          {["Pickup", "Destination", "Date and time"].map((label) => (
            <label key={label} className="block">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input className="focus-ring mt-1 h-10 w-full rounded-md border border-line px-3" />
            </label>
          ))}
          <button className="focus-ring h-10 w-full rounded-md bg-brand px-4 text-sm font-semibold text-white">
            Search
          </button>
        </div>
      </section>
      <section className="rounded-md border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-ink">Recommended Rides</h3>
        <div className="mt-4 space-y-3">
          {["Electronic City to Whitefield", "Indiranagar to Manyata Tech Park", "HSR Layout to Outer Ring Road"].map(
            (route) => (
              <article key={route} className="rounded-md border border-line p-4">
                <p className="font-medium text-ink">{route}</p>
                <p className="mt-1 text-sm text-slate-600">4 seats available · ₹120 per seat · 92% route match</p>
              </article>
            )
          )}
        </div>
      </section>
    </div>
  );
}

