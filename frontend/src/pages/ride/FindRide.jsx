import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { findRideSchema } from '../../utils/validators';
import DashboardLayout from '../../layouts/DashboardLayout';

function FindRide() {
  const navigate = useNavigate();
  
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(findRideSchema),
    defaultValues: {
      pickupLocation: '',
      destination: '',
      travelDate: '',
      travelTime: '',
      numberOfSeats: 1,
      recurringRide: false,
    },
  });

  const onSubmit = async (values) => {
    navigate('/route-confirmation', { state: { rideDetails: values } });
  };

  return (
    <DashboardLayout title="Find a Ride">
      <div className="erp-card" style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--panel-solid)' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow" style={{ color: 'var(--accent)' }}>Search a Trip</p>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Where to?</h2>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            error={errors.pickupLocation}
            icon={MapPin}
            label="Pickup Location"
            placeholder="E.g. HSR Layout, Sector 1"
            registration={register('pickupLocation')}
          />

          <InputField
            error={errors.destination}
            icon={MapPin}
            label="Destination"
            placeholder="E.g. Manyata Tech Park"
            registration={register('destination')}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '8px' }}>
            <InputField
              type="date"
              error={errors.travelDate}
              icon={Calendar}
              label="Travel Date"
              registration={register('travelDate')}
            />
            <InputField
              type="time"
              error={errors.travelTime}
              icon={Clock}
              label="Travel Time"
              registration={register('travelTime')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '8px', alignItems: 'end' }}>
            <InputField
              type="number"
              min="1"
              max="8"
              error={errors.numberOfSeats}
              icon={Users}
              label="Number of Seats"
              registration={register('numberOfSeats')}
            />
            
            <label className="field" style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '50px', cursor: 'pointer', padding: '0 16px', borderRadius: '15px', border: '1px solid var(--line-strong)', background: 'var(--panel-solid)' }}>
              <input 
                type="checkbox" 
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand)' }}
                {...register('recurringRide')}
              />
              <span style={{ fontWeight: '600', color: 'var(--text)' }}>Recurring Ride</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" disabled={isSubmitting} className="primary-button" style={{ width: 'auto', padding: '0 32px' }}>
              Calculate Route <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default FindRide;
