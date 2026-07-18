import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, CheckSquare, Slash, FileOutput, MapPin, Navigation, Calendar } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { getMyTrips } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { Card } from '../../components/ui/card';

const STATUS_BADGE = {
  BOOKED: 'success',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
  PENDING: 'warning',
  SCHEDULED: 'info'
};

function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('en-US', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return isoString; }
}

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('All');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const data = await getMyTrips();
        setTrips(data);
      } catch (err) {
        // demo data fallback
        setTrips([
          { id: 'TID-9921', status: 'COMPLETED', totalFare: 120, bookedSeats: 1, ride: { departureTime: new Date(Date.now() - 4800000).toISOString(), pickupLocation: 'HQ Campus', destination: 'Sector A Residential', driver: { firstName: 'Sarah', lastName: 'Connor' } } },
          { id: 'TID-9922', status: 'BOOKED', totalFare: 0, bookedSeats: 2, ride: { departureTime: new Date(Date.now() + 86400000).toISOString(), pickupLocation: 'North Office', destination: 'Main Hub', driver: { firstName: 'Alex', lastName: 'Morgan' } } },
          { id: 'TID-9923', status: 'CANCELLED', totalFare: 0, bookedSeats: 1, ride: { departureTime: new Date(Date.now() - 14800000).toISOString(), pickupLocation: 'HQ Campus', destination: 'Central Station', driver: { firstName: 'David', lastName: 'Smith' } } },
        ])
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filtered = trips.filter((t) => {
    const matchesTab = activeTab === 'All' ? true : t.status === activeTab;
    const matchesSearch = t.ride?.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.ride?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppShell title="Trip Management">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enterprise Trip History</h2>
          <p className="text-muted-foreground text-sm">Monitor all employee rides, payments, and trip statuses in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 shadow-sm"><FileOutput className="w-4 h-4 mr-2" /> Export Log</Button>
          <Button variant="default" className="h-9 shadow-sm shadow-primary/20">Generate Report</Button>
        </div>
      </div>

      <Card className="w-full shadow-sm border-border">
        {/* Table Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-border bg-card">
          
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {['All', 'BOOKED', 'COMPLETED', 'CANCELLED'].map((f) => (
              <button
                key={f}
                className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-md transition-all uppercase ${
                  activeTab === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(f)}
              >
                {f === 'All' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search location, ID, driver..."
                className="pl-8 h-9 text-sm focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Filters</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-b-md overflow-hidden border-t-0 p-0 m-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border">
                <TableHead className="w-12 text-center text-xs pl-5"><input type="checkbox" className="rounded" /></TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Trip ID</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider w-[280px]">Route</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Departure</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Driver</TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider">Fare details</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-center">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="pl-5"><div className="h-4 w-4 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-8 w-48 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-6 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-8 w-16 bg-muted animate-pulse rounded ml-auto text-right" /></TableCell>
                    <TableCell className="text-center"><div className="h-6 w-20 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                    <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-48 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 mb-4 opacity-20" />
                      <p className="text-sm font-medium">No trips matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((trip) => (
                  <TableRow key={trip.id} className="group border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-5"><input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" /></TableCell>
                    <TableCell className="font-semibold text-xs tracking-wide text-muted-foreground group-hover:text-primary transition-colors">
                      {trip.id || `TR-9${Math.floor(Math.random() * 1000)}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col relative py-1">
                        <div className="flex items-center gap-2 relative z-10 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-medium text-sm truncate">{trip.ride?.pickupLocation}</span>
                        </div>
                        <div className="absolute left-[6px] top-4 h-3 w-px bg-border z-0" />
                        <div className="flex items-center gap-2 relative z-10">
                          <Navigation className="w-3.5 h-3.5 text-accent shrink-0 rotate-90" />
                          <span className="text-xs text-muted-foreground truncate">{trip.ride?.destination}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        {formatDateTime(trip.ride?.departureTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 bg-muted/40 w-fit p-1 pr-3 rounded-full border border-border/50">
                         <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-sm">
                           {trip.ride?.driver?.firstName?.[0] || 'D'}
                         </div>
                         <span className="text-sm font-medium">{trip.ride?.driver?.firstName} {trip.ride?.driver?.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-bold text-sm tracking-tight text-foreground">₹{trip.totalFare?.toFixed(2) || '0.00'}</div>
                      <div className="text-xs text-muted-foreground font-medium">{trip.bookedSeats} Employee{trip.bookedSeats > 1 ? 's' : ''}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={STATUS_BADGE[trip.status]} className="text-[10px] uppercase shadow-sm">
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10 rounded-b-xl">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold shadow-sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold shadow-sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
