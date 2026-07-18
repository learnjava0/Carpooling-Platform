import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import InputField from './InputField';

function PasswordInput({ label = 'Password', ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-wrap">
      <InputField
        icon={LockKeyhole}
        label={label}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />
      <button
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="password-toggle"
        type="button"
        onClick={() => setIsVisible((current) => !current)}
      >
        {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

export default PasswordInput;
