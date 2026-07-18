import React, { useState, useEffect } from 'react';
import { Plus, ShieldCheck, Settings, Car, AlertCircle, X, FileText, Wrench, MoreHorizontal, Fuel, Zap, History } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { getMyVehicles } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";


export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await getMyVehicles();
        setVehicles(data);
      } catch (err) {
        setVehicles([
          { id: 1, model: 'Tesla Model 3', registrationNumber: 'CA-1029-EV', seatingCapacity: 4, fuelType: 'Electric', mileage: '25,320 km', status: 'Active', nextService: '12 Nov 2026' },
          { id: 2, model: 'Toyota Innova Crysta', registrationNumber: 'NY-4421-XB', seatingCapacity: 6, fuelType: 'Diesel', mileage: '82,100 km', status: 'Maintenance Required', nextService: 'Overdue' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <AppShell title="Fleet Management">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Active Vehicles</h2>
          <p className="text-muted-foreground text-sm">Manage your registered vehicles, view analytics, and track maintenance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Register Vehicle
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted/60" />
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-2/3 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                <div className="flex justify-between gap-4">
                  <div className="h-10 bg-muted rounded w-full" />
                  <div className="h-10 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Card key={v.id} className="overflow-hidden flex flex-col hover:border-primary/50 transition-colors shadow-sm">
              <div className="h-36 bg-gradient-to-tr from-muted to-muted/30 relative border-b border-border flex items-center justify-center p-4">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Badge variant={v.status === 'Active' ? 'success' : 'warning'} className="shadow-sm">
                    {v.status}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border/50 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-sm">
                  {v.registrationNumber}
                </div>
                {v.fuelType === 'Electric' ? (
                  <Zap className="w-16 h-16 text-muted-foreground/30 absolute right-4 bottom-[-10px] -rotate-12" />
                ) : (
                  <Fuel className="w-16 h-16 text-muted-foreground/30 absolute right-4 bottom-[-10px] -rotate-12" />
                )}
                
                <Car className="w-24 h-24 text-primary/40 relative z-10 drop-shadow-md" />
              </div>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{v.model}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Fleet Vehicle
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] bg-card border-border shadow-md rounded-md p-1">
                      <DropdownMenuItem className="flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-muted rounded-sm">
                        <History className="mr-2 h-4 w-4" /> Trip History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-muted rounded-sm">
                        <Settings className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-2">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Capacity</span>
                    <span className="font-semibold">{v.seatingCapacity} Seats</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Fuel Type</span>
                    <span className="font-semibold">{v.fuelType}</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Total Mileage</span>
                    <span className="font-semibold">{v.mileage}</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg border border-border/50 relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Next Service</span>
                    <span className={`font-semibold ${v.nextService === 'Overdue' ? 'text-destructive' : ''}`}>{v.nextService}</span>
                    {v.nextService === 'Overdue' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-destructive" />}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 gap-3">
                <Button variant="outline" className="w-full h-9 text-xs shadow-sm bg-background">
                  <FileText className="w-3.5 h-3.5 mr-2" /> Documents
                </Button>
                <Button variant={v.nextService === 'Overdue' ? 'destructive' : 'secondary'} className="w-full h-9 text-xs shadow-sm">
                  <Wrench className="w-3.5 h-3.5 mr-2" /> Maintenance
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed border-border flex flex-col items-center justify-center p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer min-h-[350px]">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <CardTitle>Register New Vehicle</CardTitle>
            <CardDescription className="max-w-[200px] mt-2">
              Add a new vehicle to your corporate fleet to start offering rides.
            </CardDescription>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
