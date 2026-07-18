import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import { CarFront } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const successMessage = location.state?.message;

  const { formState: { errors, isSubmitting }, handleSubmit, register } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values, role = 'employee') => {
    setServerError('');
    try {
      await login(values);
      navigate('/splash', {
        replace: true,
        state: { next: location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/dashboard') },
      });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Check your details.');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        {/* Logo row */}
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSubmit((v) => onSubmit(v, 'employee'))(); }}>
            <InputField
              autoComplete="email"
              error={errors.email}
              icon={Mail}
              label="Email / Mobile"
              placeholder="name@company.com"
              registration={register('email')}
            />

            <PasswordInput
              autoComplete="current-password"
              error={errors.password}
              label="Password"
              placeholder="Your password"
              registration={register('password')}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="link-btn" style={{ fontSize: '0.82rem' }}>
                Forgot password?
              </button>
            </div>

            {serverError && <p className="alert alert-error">{serverError}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

            <PrimaryButton isLoading={isSubmitting} type="submit">
              Log in as Employee
            </PrimaryButton>

            <div className="divider">Or</div>

            <button
              type="button"
              className="secondary-button"
              style={{ width: '100%', minHeight: '46px' }}
              onClick={() => handleSubmit((v) => onSubmit(v, 'admin'))()}
            >
              <Shield size={16} />
              Log in as Admin
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
