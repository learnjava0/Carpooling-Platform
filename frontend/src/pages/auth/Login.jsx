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

  const { formState: { errors, isSubmitting }, handleSubmit, register, setValue } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const session = await login(values);
      const role = session?.user?.role;
      // Redirect admin to /admin, employees to /dashboard (or wherever they came from)
      const defaultPath = role === 'COMPANY_ADMIN' ? '/admin' : '/dashboard';
      const next = location.state?.from?.pathname || defaultPath;
      navigate(next, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Check your credentials.'
      );
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--brand-dim)' }}>
            <div style={{ gridColumn: '1 / -1', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>Hackathon Demo Quick Login</div>
            <button type="button" className="secondary-button" onClick={() => fillDemo('admin@odoo.com', 'admin123')}>
              Admin
            </button>
            <button type="button" className="secondary-button" onClick={() => fillDemo('john@odoo.com', 'password123')}>
              Employee
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              autoComplete="email"
              error={errors.email}
              icon={Mail}
              label="Email"
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
              Sign In
            </PrimaryButton>

            <div className="divider">
              <Shield size={13} style={{ opacity: 0.5 }} />
              Role is determined automatically from your account
            </div>

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
