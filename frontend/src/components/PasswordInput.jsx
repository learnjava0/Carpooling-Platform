import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

function PasswordInput({ label, error, registration, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <div className={`input-shell ${error ? 'input-error' : ''}`} style={{ position: 'relative' }}>
        <Lock size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
        <input
          type={show ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          style={{ paddingRight: 36 }}
          {...registration}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow(s => !s)}
          style={{ position: 'static', marginLeft: 'auto', flexShrink: 0 }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <small className="error-text">{error.message}</small>}
    </label>
  );
}

export default PasswordInput;
