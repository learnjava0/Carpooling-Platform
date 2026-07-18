import { CarFront } from 'lucide-react';

function Logo({ compact = false }) {
  return (
    <div className="brand-logo" aria-label="Carpooling">
      <div className="brand-mark">
        <CarFront size={compact ? 16 : 18} aria-hidden="true" />
      </div>
      <div>
        <strong>Carpooling</strong>
        {!compact && <small>Ride Together · Save Together</small>}
      </div>
    </div>
  );
}

export default Logo;
