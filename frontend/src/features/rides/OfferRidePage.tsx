export function OfferRidePage() {
  return (
    <section className="max-w-3xl rounded-md border border-line bg-white p-5">
      <h2 className="text-xl font-semibold text-ink">Offer Ride</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {["Pickup", "Destination", "Departure time", "Available seats", "Price per seat", "Vehicle"].map((label) => (
          <label key={label} className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input className="focus-ring mt-1 h-10 w-full rounded-md border border-line px-3" />
          </label>
        ))}
      </div>
      <button className="focus-ring mt-5 h-10 rounded-md bg-brand px-4 text-sm font-semibold text-white">
        Publish Ride
      </button>
    </section>
  );
}

