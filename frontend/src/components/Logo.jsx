import { CarFront } from 'lucide-react';

function Logo({ compact = false }) {
  return (
    <div className="brand-logo" aria-label="Carpooling">
      <span className="brand-mark">
        <CarFront size={compact ? 18 : 24} aria-hidden="true" />
      </span>
      <span>
        <strong>Carpooling</strong>
        {!compact && <small>Ride Together · Save Together</small>}
      </span>
    </div>
  );
}

export default Logo;
