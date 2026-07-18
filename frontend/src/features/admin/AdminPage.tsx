export function AdminPage() {
  return (
    <section className="rounded-md border border-line bg-white p-5">
      <h2 className="text-xl font-semibold text-ink">Company Admin</h2>
      <div className="mt-5 overflow-hidden rounded-md border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-panel text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Trips</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {["Priya Sharma", "Arjun Mehta", "Nisha Rao"].map((name, index) => (
              <tr key={name}>
                <td className="px-4 py-3 font-medium text-ink">{name}</td>
                <td className="px-4 py-3 text-slate-600">{index === 0 ? "Company Admin" : "Employee"}</td>
                <td className="px-4 py-3 text-brand">Active</td>
                <td className="px-4 py-3 text-slate-600">{36 - index * 7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

