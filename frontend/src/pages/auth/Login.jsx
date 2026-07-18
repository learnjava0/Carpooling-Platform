import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const successMessage = location.state?.message;

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values, role) => {
    setServerError('');

    try {
      await login(values);
      // Navigate to splash after login instead of dashboard
      navigate('/splash', { replace: true, state: { next: location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/dashboard') } });
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Login failed. Please check your details.',
      );
    }
  };

  return (
    <AuthLayout eyebrow="Welcome Back" title="Hi there!">
      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSubmit((v) => onSubmit(v, 'employee'))(); }}>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontWeight: 500 }}>Have we met before?</p>
        
        <InputField
          autoComplete="email"
          error={errors.email}
          icon={Mail}
          label="Email"
          placeholder="name@email.com"
          registration={register('email')}
        />

        <PasswordInput
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          placeholder="********"
          registration={register('password')}
        />

        {serverError && <p className="alert error-alert">{serverError}</p>}
        {successMessage && <p className="alert success-alert">{successMessage}</p>}

        <PrimaryButton isLoading={isSubmitting} type="submit" style={{ marginTop: '16px' }}>
          Log in as Employee
        </PrimaryButton>

        <div className="divider" style={{ margin: '24px 0' }}>
          <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
          <small style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>OR</small>
          <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        </div>

        <button 
          className="google-button" 
          type="button"
          onClick={() => handleSubmit((v) => onSubmit(v, 'admin'))()}
          style={{ width: '100%', background: 'transparent', border: '1px solid var(--text)', color: 'var(--text)', borderRadius: '30px' }}
        >
          <Shield size={18} />
          <span>Log in as Admin</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', fontSize: '0.9rem' }}>
          <button className="link-button" type="button" style={{ fontWeight: 600, color: 'var(--text)' }}>
            Forgot my password
          </button>
          <button className="link-button" type="button" style={{ fontWeight: 600, color: 'var(--text)' }}>
            Log in with SSO
          </button>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--muted)' }}>Don't have an account? </span>
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--text)', textDecoration: 'none', borderBottom: '1px solid var(--text)' }}>
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
