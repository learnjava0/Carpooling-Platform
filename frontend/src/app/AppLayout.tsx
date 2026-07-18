import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Car, CircleDollarSign, MapPinned, Route, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/find", label: "Find Ride", icon: MapPinned },
  { to: "/offer", label: "Offer Ride", icon: Route },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/wallet", label: "Wallet", icon: CircleDollarSign },
  { to: "/admin", label: "Admin", icon: Users }
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 md:block">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">CarpoolOps</p>
          <h1 className="text-2xl font-semibold text-ink">Enterprise Rides</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium ${
                  isActive ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acme Mobility</p>
              <h2 className="text-lg font-semibold text-ink">Operations Console</h2>
            </div>
            <button className="focus-ring rounded-md border border-line px-3 py-2 text-sm font-medium text-slate-700">
              Demo Admin
            </button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

