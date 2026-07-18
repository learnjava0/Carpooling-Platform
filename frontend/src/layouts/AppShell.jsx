import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Settings, Bell, LogOut, ChevronRight,
  PlusCircle, Map, History, Car, Wallet, MessageSquare, Shield, Activity, MapPin, Sparkles, Navigation2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const modules = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Find Ride', path: '/find-ride', icon: Search },
  { name: 'Offer Ride', path: '/offer-ride', icon: PlusCircle },
  { name: 'My Trips', path: '/trips', icon: Map },
  { name: 'Live Tracking', path: '/tracking', icon: Navigation2 },
  { name: 'Ride History', path: '/ride-history', icon: History },
  { name: 'My Vehicles', path: '/vehicles', icon: Car },
  { name: 'Wallet & Payments', path: '/wallet', icon: Wallet },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Admin Hub', path: '/admin', icon: Shield, adminOnly: true },
];

export default function AppShell({ children, title }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const visibleModules = modules.filter(m => !m.adminOnly || isAdmin);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans text-foreground">
      
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out relative z-20 shadow-sm",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Car className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-bold tracking-tight">Enterprise Mobility</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carpool Operations</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors absolute -right-3 top-5 bg-card border border-border shadow-sm z-30"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5 rotate-180" />}
          </button>
        </div>

        <div className="p-3 border-b border-border">
          {!collapsed ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search rides, employees..."
                className="w-full bg-muted/50 pl-9 border-none h-9 text-sm focus-visible:ring-1 focus-visible:bg-background transition-colors rounded-md"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 hide-scrollbar">
          {visibleModules.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all group overflow-hidden relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>
        
        {/* Settings pinned to bottom */}
        <div className="px-2 pb-2">
            <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all group overflow-hidden relative",
                  location.pathname.startsWith('/settings')
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings className={cn("h-5 w-5 shrink-0 transition-colors", location.pathname.startsWith('/settings') ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span>Settings</span>}
              </Link>
        </div>

        <div className="border-t border-border p-3">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3 px-2")}>
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold">{user?.firstName || 'User'} {user?.lastName || ''}</span>
                <span className="truncate text-xs text-muted-foreground">{isAdmin ? 'Company Admin' : 'Employee'}</span>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC] dark:bg-background">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">{title || 'Dashboard'}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex h-8 rounded-full shadow-sm text-xs border-border/60">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              HQ Campus
            </Button>
            
            <div className="relative">
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-[1.5px] border-card"></span>
              </button>
            </div>
            
            <Button variant="default" size="sm" className="h-8 shadow-sm">
              <PlusCircle className="w-4 h-4 mr-2" /> Offer Ride
            </Button>
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
