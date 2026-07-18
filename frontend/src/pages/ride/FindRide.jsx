import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { findRideSchema } from '../../utils/validators';
import AppShell from '../../layouts/AppShell';

export default function FindRide() {
  const navigate = useNavigate();
  const { formState: { errors, isSubmitting }, handleSubmit, register, setValue, getValues } = useForm({
    resolver: zodResolver(findRideSchema),
    defaultValues: { pickupLocation: '', destination: '', travelDate: '', travelTime: '', numberOfSeats: 1, recurringRide: false },
  });

  const swap = () => {
    const { pickupLocation, destination } = getValues();
    setValue('pickupLocation', destination);
    setValue('destination', pickupLocation);
  };

  return (
    <AppShell title="Find a Ride">
      <div className="form-layout">
        {/* Form */}
        <form onSubmit={handleSubmit(v => navigate('/route-confirmation', { state: { rideDetails: v } }))}>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Route</p>
            <div className="stack">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <InputField error={errors.pickupLocation} icon={MapPin} label="Start Location" placeholder="e.g. HSR Layout, Bangalore" registration={register('pickupLocation')} />
                </div>
                <button type="button" className="swap-btn" onClick={swap} aria-label="Swap" style={{ marginBottom: 1 }}>
                  <ArrowLeftRight size={14} />
                </button>
              </div>
              <InputField error={errors.destination} icon={MapPin} label="Destination" placeholder="e.g. Manyata Tech Park" registration={register('destination')} />
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

        {/* Map preview */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Route Preview</p>
            <div className="map-placeholder" style={{ height: 280 }}>
              <div className="map-route-line" />
              <MapPin size={32} style={{ opacity: 0.35 }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Enter locations to preview</span>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--brand-dim)', borderColor: 'rgba(244,176,0,0.2)' }}>
            <p className="section-label" style={{ color: 'var(--brand)' }}>Quick Tip</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
              Use your registered office location as the destination. Rides are matched based on pickup proximity to your route.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
