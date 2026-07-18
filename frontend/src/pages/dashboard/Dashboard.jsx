import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { useAuth } from '../../hooks/useAuth';
import { getMyTrips, getWallet } from '../../services/api';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  TrendingUp, Leaf, DollarSign, Activity, Settings, User, MapPin, Map,
  Clock, AlertCircle, ChevronRight, Zap, Lightbulb, Fuel, Search, Navigation, CheckCircle2, Car
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { Input } from '../../components/ui/input';

const revenueData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 180 },
  { name: 'Wed', value: 150 },
  { name: 'Thu', value: 240 },
  { name: 'Fri', value: 290 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 110 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.firstName || 'User';
  const [trips, setTrips] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsData, walletData] = await Promise.all([
          getMyTrips().catch(() => []),
          getWallet().catch(() => null),
        ]);
        setTrips(tripsData);
        setWallet(walletData);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const completedTrips = trips.filter((t) => t.status === 'COMPLETED');
  const upcomingTrips  = trips.filter((t) => t.status === 'BOOKED');
  
  return (
    <AppShell title="Mobility Overview">
      
      {/* Welcome & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#0c5852] text-primary-foreground p-8 shadow-md">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Your Commute, Optimized.</h2>
              <p className="text-primary-foreground/80 max-w-lg mb-6 leading-relaxed">
                Welcome back, {name}. Your company has reduced <span className="font-bold text-white">450kg</span> of CO₂ this week through carpooling.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-sm" asChild>
                <Link to="/find-ride"><Search className="w-4 h-4 mr-2" /> Find a Ride</Link>
              </Button>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 shadow-sm" asChild>
                <Link to="/offer-ride"><Map className="w-4 h-4 mr-2" /> Offer a Ride</Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          <SparklesBg />
        </div>
      </div>

      {/* KPI Cards */}
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Enterprise Impact metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="CO₂ Reduction" value={`${(completedTrips.length * 15 * 0.12).toFixed(1)} kg`} trend="+12% from last wk" icon={Leaf} trendUp />
        <KPICard title="Total Trips Taken" value={trips.length.toString()} trend="Steady usage" icon={Activity} />
        <KPICard title="Fuel Savings (Est)" value={`₹${(completedTrips.length * 350).toFixed(0)}`} trend="+15% from last wk" icon={Fuel} trendUp />
        <KPICard title="Avg Occupancy" value="2.8" trend="+0.2 seats" icon={User} trendUp />
      </div>

      {/* Live tracking and charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Rides Overview</CardTitle>
              <CardDescription>Number of rides facilitated per day</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground">30D</button>
              <button className="px-3 py-1 text-xs font-semibold bg-background shadow-sm rounded-md">7D</button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Trip Tracker Mockup */}
        <Card className="shadow-sm border border-border flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Active Trip Status <Badge variant="success" className="animate-pulse">Live</Badge>
            </CardTitle>
            <CardDescription>Driver: Sarah Jenkins</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="bg-muted/30 p-4 rounded-xl relative overflow-hidden mb-4 border border-border h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=13&size=400x400&style=feature:all|element:labels|visibility:off&client=gme-dummy')] opacity-20 bg-cover bg-center" />
              <div className="relative z-10 flex flex-col items-center max-w-[200px] text-center">
                <Navigation className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-lg">14 Mins Away</span>
                <span className="text-xs text-muted-foreground font-medium bg-background px-2 py-1 rounded-md mt-2 shadow-sm">Traffic is moderate</span>
              </div>
            </div>
            
            <div className="space-y-4 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 border-2 border-background shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Pickup: HQ Campus</span>
                  <span className="text-xs text-muted-foreground">5:15 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 border-2 border-background shadow-sm">
                  <Car className="w-3 h-3 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Current Location</span>
                  <span className="text-xs text-primary font-medium">Navigating</span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10 opacity-60">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 border-2 border-background shadow-sm">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Dropoff: Sector 62</span>
                  <span className="text-xs text-muted-foreground">Est. 5:45 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4 border-t border-border/50 mt-4 px-4 flex gap-2">
            <Button variant="outline" className="w-full text-xs h-9">Contact Driver</Button>
            <Button variant="secondary" className="w-full text-xs h-9">Share ETA</Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}

function KPICard({ title, value, trend, icon: Icon, trendUp }) {
  return (
    <Card className="shadow-sm border-border/60 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground tracking-tight uppercase">{title}</span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black tracking-tight">{value}</span>
          <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
            {trendUp !== undefined && (
              <span className={cn(trendUp ? "text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm" : "text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm")}>
                {trend}
              </span>
            )}
            {trendUp === undefined && <span className="text-muted-foreground">{trend}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SparklesBg() {
  return (
    <div className="absolute inset-0 right-0 pointer-events-none overflow-hidden opacity-30">
       <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[120%] bg-white/20 blur-[80px] rounded-full rotate-45 transform" />
    </div>
  )
}
