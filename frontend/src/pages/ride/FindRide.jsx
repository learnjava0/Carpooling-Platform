import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDeferredValue } from 'react';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import RouteMap from '../../components/RouteMap';
import { findRideSchema } from '../../utils/validators';
import AppShell from '../../layouts/AppShell';

export default function FindRide() {
  const navigate = useNavigate();
  const { control, formState: { errors, isSubmitting }, handleSubmit, register, setValue, getValues } = useForm({
    resolver: zodResolver(findRideSchema),
    defaultValues: { pickupLocation: '', destination: '', travelDate: '', travelTime: '', numberOfSeats: 1, recurringRide: false },
  });

  // Debounced values so we don't geocode every keystroke
  const rawFrom = useWatch({ control, name: 'pickupLocation' });
  const rawTo   = useWatch({ control, name: 'destination' });
  const from    = useDeferredValue(rawFrom);
  const to      = useDeferredValue(rawTo);

  const swap = () => {
    const { pickupLocation, destination } = getValues();
    setValue('pickupLocation', destination);
    setValue('destination', pickupLocation);
  };

  return (
    <AppShell title="Find a Ride">
      <div className="form-layout">
        {/* ── Left: form ── */}
        <form onSubmit={handleSubmit(v => navigate('/route-confirmation', { state: { rideDetails: v } }))}>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Route</p>
            <div className="stack">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <InputField
                    error={errors.pickupLocation}
                    icon={MapPin}
                    label="Start Location"
                    placeholder="e.g. HSR Layout"
                    registration={register('pickupLocation')}
                  />
                </div>
                <button type="button" className="swap-btn" onClick={swap} aria-label="Swap" style={{ marginBottom: 1 }}>
                  <ArrowLeftRight size={14} />
                </button>
              </div>
              <InputField
                error={errors.destination}
                icon={MapPin}
                label="Destination"
                placeholder="e.g. Manyata Tech Park"
                registration={register('destination')}
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Date &amp; Time</p>
            <div className="datetime-row">
              <InputField type="date" error={errors.travelDate} icon={Calendar} label="Date" registration={register('travelDate')} />
              <InputField type="time" error={errors.travelTime} icon={Clock} label="Time" registration={register('travelTime')} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <p className="section-label">Preferences</p>
            <div className="form-row">
              <InputField type="number" min="1" max="8" error={errors.numberOfSeats} icon={Users} label="Seats Needed" registration={register('numberOfSeats')} />
              <label className="checkbox-pill" style={{ alignSelf: 'flex-end' }}>
                <input type="checkbox" {...register('recurringRide')} />
                <span>Recurring Ride</span>
              </label>
            </div>
          </div>

          <PrimaryButton isLoading={isSubmitting} type="submit">
            Calculate Route <ArrowRight size={16} />
          </PrimaryButton>
        </form>

        {/* ── Right: live map ── */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Route Preview</p>
            <RouteMap from={from} to={to} height="300px" />
          </div>

          <div className="card" style={{ background: 'var(--brand-dim)', borderColor: 'rgba(244,176,0,0.2)' }}>
            <p className="section-label" style={{ color: 'var(--brand)' }}>Quick Tip</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
              Use your office address as the destination. Rides are matched based on pickup proximity to the route.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
