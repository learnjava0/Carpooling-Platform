import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, Phone, Upload, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import { CarFront } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [preview, setPreview] = useState('');

  const { formState: { errors, isSubmitting }, handleSubmit, register, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', phone: '', email: '',
      companyCode: '', password: '', confirmPassword: '',
    },
  });

  const profileImage = watch('profileImage');
  useEffect(() => {
    if (profileImage?.[0]) {
      const url = URL.createObjectURL(profileImage[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview('');
    return undefined;
  }, [profileImage]);

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await registerUser(values);
      navigate('/login', { replace: true, state: { message: 'Account created. Please log in.' } });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '32px' }}>
      <div className="auth-shell">
        <div className="auth-logo-row">
          <div className="brand-logo">
            <div className="brand-mark"><CarFront size={18} /></div>
            <div>
              <strong>Carpooling</strong>
              <small>Ride Together · Save Together</small>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join your company's carpooling network</p>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Avatar upload */}
            <label className="avatar-upload">
              <input accept="image/*" type="file" {...register('profileImage')} />
              <span className="avatar-preview">
                {preview ? <img alt="Profile preview" src={preview} /> : <Upload size={20} />}
              </span>
              <span>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text)' }}>Upload profile photo</strong>
                <small style={{ color: 'var(--text-3)' }}>Tap to choose image</small>
              </span>
            </label>
            {errors.profileImage && <small className="error-text">{errors.profileImage.message}</small>}

            <div className="two-col">
              <InputField error={errors.firstName} icon={UserRound} label="First Name" placeholder="First" registration={register('firstName')} />
              <InputField error={errors.lastName} icon={UserRound} label="Last Name" placeholder="Last" registration={register('lastName')} />
            </div>

            <InputField error={errors.phone} icon={Phone} inputMode="tel" label="Phone" placeholder="10-digit number" registration={register('phone')} />
            <InputField autoComplete="email" error={errors.email} icon={Mail} label="Email" placeholder="work@company.com" registration={register('email')} />
            <InputField error={errors.companyCode} icon={Building2} label="Company Code" placeholder="Company access code" registration={register('companyCode')} />

            <PasswordInput autoComplete="new-password" error={errors.password} label="Password" placeholder="Min 8 characters" registration={register('password')} />
            <PasswordInput autoComplete="new-password" error={errors.confirmPassword} label="Confirm Password" placeholder="Repeat password" registration={register('confirmPassword')} />

            {serverError && <p className="alert alert-error">{serverError}</p>}

            <PrimaryButton isLoading={isSubmitting} type="submit">Create Account</PrimaryButton>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
