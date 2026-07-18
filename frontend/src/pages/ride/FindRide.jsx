import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { findRideSchema } from '../../utils/validators';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

function FindRide() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
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
    // In a real app we'd fetch or pass state. We just go to route confirmation.
    navigate('/route-confirmation', { state: { rideDetails: values } });
  };

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav">
        <Logo />
        <button className="secondary-button" type="button" onClick={logout}>
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </nav>
      
      <div className="dashboard-grid">
        <section className="dashboard-card" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
          <button 
            type="button" 
            className="link-button" 
            style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <p className="eyebrow">Search a Trip</p>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Find a Ride</h1>
          
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

            <div className="two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

            <div className="two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
              <InputField
                type="number"
                min="1"
                max="8"
                error={errors.numberOfSeats}
                icon={Users}
                label="Number of Seats"
                registration={register('numberOfSeats')}
              />
              
              <label className="field" style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '48px', cursor: 'pointer', paddingBottom: '8px' }}>
                <input 
                  type="checkbox" 
                  style={{ width: '20px', height: '20px' }}
                  {...register('recurringRide')}
                />
                <span style={{ fontWeight: '500' }}>Recurring Ride</span>
              </label>
            </div>

            <PrimaryButton isLoading={isSubmitting} type="submit" style={{ marginTop: '16px' }}>
              Calculate Route
            </PrimaryButton>
          </form>
        </section>
      </div>
    </main>
  );
}

export default FindRide;
