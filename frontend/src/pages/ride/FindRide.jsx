import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeftRight, Navigation } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { findRideSchema } from '../../utils/validators';
import AppShell from '../../layouts/AppShell';
import RouteMap from '../../components/RouteMap';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';

export default function FindRide() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, control } = useForm({
    resolver: zodResolver(findRideSchema),
    defaultValues: { pickupLocation: '', destination: '', travelDate: '', travelTime: '', numberOfSeats: 1, recurringRide: false },
  });

  const rawFrom = useWatch({ control, name: 'pickupLocation' });
  const rawTo   = useWatch({ control, name: 'destination' });
  
  const [from, setFrom] = useState(rawFrom);
  const [to, setTo] = useState(rawTo);

  useEffect(() => {
    const t = setTimeout(() => {
      setFrom(rawFrom);
      setTo(rawTo);
    }, 1000);
    return () => clearTimeout(t);
  }, [rawFrom, rawTo]);

  const swap = () => {
    const { pickupLocation, destination } = getValues();
    setValue('pickupLocation', destination);
    setValue('destination', pickupLocation);
  };

  return (
    <AppShell title="Ride Discovery">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Left Side: Search Form */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Find a Ride</h2>
            <p className="text-muted-foreground text-sm">Discover and book routes securely within the corporate network.</p>
          </div>

          <form onSubmit={handleSubmit(v => navigate('/route-confirmation', { state: { rideDetails: v } }))} className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Route Details</h3>
                
                <div className="space-y-4 relative">
                  <div className="absolute left-[11px] top-6 bottom-8 w-0.5 bg-border rounded-full" />
                  
                  <div className="relative pl-8">
                    <div className="absolute left-[7px] top-[14px] w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                    <Input 
                      placeholder="Start Location (e.g. Sector 62)" 
                      className={`bg-muted/50 ${errors.pickupLocation ? 'border-destructive' : ''}`}
                      {...register('pickupLocation')}
                    />
                  </div>
                  
                  <div className="absolute left-[-5px] top-[50%] -translate-y-1/2 z-10 hidden sm:block">
                    <button type="button" onClick={swap} className="w-7 h-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                      <ArrowLeftRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-[8px] top-[14px] w-2 h-2 rounded-sm bg-accent ring-4 ring-accent/20" />
                    <Input 
                      placeholder="Destination (e.g. HQ Campus)" 
                      className={`bg-muted/50 ${errors.destination ? 'border-destructive' : ''}`}
                      {...register('destination')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Schedule & Preferences</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Date</label>
                    <Input type="date" className={`bg-muted/50 text-sm ${errors.travelDate ? 'border-destructive' : ''}`} {...register('travelDate')} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Time</label>
                    <Input type="time" className={`bg-muted/50 text-sm ${errors.travelTime ? 'border-destructive' : ''}`} {...register('travelTime')} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Seats</label>
                    <Input type="number" min="1" max="8" className={`bg-muted/50 text-sm ${errors.numberOfSeats ? 'border-destructive' : ''}`} {...register('numberOfSeats')} />
                  </div>
                  
                  <label className="flex items-center gap-2 h-9 p-2 rounded border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input type="checkbox" className="rounded" {...register('recurringRide')} />
                    <span className="text-xs font-medium">Recurring</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full h-12 text-base shadow-sm font-bold">
              Search Rides <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>

        {/* Right Side: Map & Suggestions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1 overflow-hidden min-h-[400px] border border-border shadow-sm relative group">
             
            {(from || to) ? (
              <RouteMap from={from} to={to} height="100%" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none">
                <Navigation className="w-12 h-12 text-muted-foreground/30 mb-2" />
                <span className="text-muted-foreground font-medium text-sm">Enter route details to view map</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-sm p-3 text-xs flex flex-col gap-1 w-48">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">Traffic</span>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 w-3/4" />
                </div>
                <span className="text-[10px] text-right mt-0.5">Light delays (5-10m)</span>
              </div>
            </div>
          </Card>
          
          <Card className="bg-primary/5 border border-primary/20 shadow-[inset_0_0_10px_rgba(15,118,110,0.05)]">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-primary mb-1">Enterprise Carpool Program</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rides booked between 8 AM - 10 AM on weekdays receive a secondary insurance claim boost automatically through our enterprise policy. Ensure details are accurate.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
