import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2, ArrowLeftRight, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import RouteMap from '../../components/RouteMap';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';

export default function OfferRide() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    from: '', to: '', date: '', time: '',
    vehicleId: '1', seats: 3, price: 50,
  });

  // Debounce for Map
  const [debouncedFrom, setDebouncedFrom] = useState(form.from);
  const [debouncedTo, setDebouncedTo] = useState(form.to);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedFrom(form.from);
      setDebouncedTo(form.to);
    }, 1000);
    return () => clearTimeout(t);
  }, [form.from, form.to]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AppShell title="Publish Ride">
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Offer a Commute</h2>
          <p className="text-muted-foreground">Share your daily route with colleagues and save on fuel costs.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }} />
          
          {['Route Info', 'Trip Details', 'Review & Publish'].map((label, i) => {
            const num = i + 1;
            const isActive = step >= num;
            const isDone = step > num;
            return (
              <div key={label} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 shadow-sm ${
                  isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5 text-primary-foreground" /> : num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
              </div>
            )
          })}
        </div>

        {/* ── Main Layout: Form Left, Map Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form Steps */}
          <div className="flex flex-col">
            {/* ── Step 1: Route ── */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center"><MapPin className="w-5 h-5 mr-2 text-primary" /> Where are you going?</h3>
                    
                    <div className="space-y-6 relative">
                      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border rounded-full" />
                      
                      <div className="relative pl-12">
                        <div className="absolute left-[20px] top-[14px] w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Start Location</label>
                        <Input 
                          className="bg-muted/50 border-border shadow-inner" 
                          placeholder="e.g. Sector 62, Noida" 
                          value={form.from} onChange={e => set('from', e.target.value)}
                        />
                      </div>
                      
                      <div className="absolute left-[3px] top-1/2 -translate-y-1/2 z-10">
                        <button type="button" className="w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:border-primary/50" onClick={() => setForm(f => ({...f, from: f.to, to: f.from}))}>
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="relative pl-12">
                        <div className="absolute left-[21px] top-[14px] w-2 h-2 rounded-sm bg-accent ring-4 ring-accent/20" />
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Destination</label>
                        <Input 
                          className="bg-muted/50 border-border shadow-inner" 
                          placeholder="e.g. Tech Park, Gurugram" 
                          value={form.to} onChange={e => set('to', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <Button className="w-full h-11 text-base shadow-sm" disabled={!form.from || !form.to} onClick={() => setStep(2)}>
                        Continue to Details <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Step 2: Details ── */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <Card className="shadow-sm">
                  <CardContent className="p-8 space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center border-b border-border pb-2"><Calendar className="w-5 h-5 mr-2 text-primary" /> Departure Time</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Date</label>
                          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="bg-muted/50" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Time</label>
                          <Input type="time" value={form.time} onChange={e => set('time', e.target.value)} className="bg-muted/50" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center border-b border-border pb-2"><Car className="w-5 h-5 mr-2 text-primary" /> Vehicle & Capacity</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Select Vehicle</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)}>
                            <option value="1">Tesla Model 3 (CA-1029-EV)</option>
                            <option value="2">Toyota Innova (NY-4421-XB)</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Offered Seats</label>
                            <Input type="number" min="1" max="4" value={form.seats} onChange={e => set('seats', e.target.value)} className="bg-muted/50 text-lg font-bold text-primary" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Fare per seat (₹)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-[10px] text-muted-foreground font-bold">₹</span>
                              <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} className="bg-muted/50 pl-7 text-lg font-bold text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm">
                      <Zap className="w-5 h-5 mr-3 shrink-0" />
                      <p><strong>AI Suggestion:</strong> Similar rides on this route are typically priced around ₹45-₹60. Your pricing is optimal.</p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border mt-4">
                      <Button variant="outline" className="w-1/3 h-11" onClick={() => setStep(1)}>Back</Button>
                      <Button className="w-2/3 h-11 shadow-sm" disabled={!form.date || !form.time} onClick={() => setStep(3)}>Proceed to Review <ChevronRight className="w-4 h-4 ml-2" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <Card className="shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold mb-6 border-b border-border pb-2">Trip Summary</h3>
                    
                    <div className="flex flex-col gap-6">
                      <div className="p-4 bg-muted/40 rounded-xl border border-border/50 relative">
                        <div className="flex items-center gap-4 relative z-10 mb-4">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border-2 border-background">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Pickup</span>
                            <span className="text-sm font-semibold">{form.from}</span>
                          </div>
                        </div>
                        <div className="absolute left-8 top-10 bottom-6 w-px bg-border z-0" />
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border-2 border-background">
                            <MapPin className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Dropoff</span>
                            <span className="text-sm font-semibold">{form.to}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card border border-border p-3 rounded-lg shadow-sm">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Departure</span>
                          <span className="font-semibold text-sm">{form.date} at {form.time}</span>
                        </div>
                        <div className="bg-card border border-border p-3 rounded-lg shadow-sm">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Vehicle</span>
                          <span className="font-semibold text-sm">Tesla Model 3</span>
                        </div>
                        <div className="bg-card border border-border p-3 rounded-lg shadow-sm">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Seats Available</span>
                          <span className="font-semibold text-sm">{form.seats}</span>
                        </div>
                        <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg shadow-sm">
                          <span className="text-[10px] text-primary uppercase font-bold tracking-wider block mb-1">Fare (Per Seat)</span>
                          <span className="font-bold text-lg text-primary">₹{form.price}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs leading-relaxed">
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>Your ride complies with company policy. Passengers will be covered under corporate transit insurance.</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4 pt-6 border-t border-border">
                      <Button variant="outline" className="w-1/3 h-11" onClick={() => setStep(2)}>Back</Button>
                      <Button className="w-2/3 h-11 text-base shadow-md" onClick={() => navigate('/trips')}>
                        Confirm & Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column: Always map and other stats */}
          <div className="flex flex-col gap-6 h-full min-h-[400px]">
            <div className="bg-muted/30 overflow-hidden relative border-dashed border border-border shadow-sm rounded-xl flex-1 flex flex-col min-h-[300px]">
               {(!form.from && !form.to) ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                    <MapPin className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium text-sm">Interactive map route will appear here once you enter your locations.</p>
                 </div>
               ) : (
                 <RouteMap from={debouncedFrom} to={debouncedTo} height="100%" />
               )}
            </div>
            
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-md">
                  <CardContent className="p-6 relative z-10">
                    <h3 className="font-bold text-lg mb-2">Estimated Earnings</h3>
                    <div className="text-4xl font-black mb-1 tracking-tight">₹{form.price * form.seats}</div>
                    <p className="text-primary-foreground/80 text-sm">If all {form.seats} seats are booked</p>
                  </CardContent>
                  <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                </Card>
              </div>
            )}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
