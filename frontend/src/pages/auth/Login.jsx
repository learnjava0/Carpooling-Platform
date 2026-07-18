import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
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

  const onSubmit = async (values) => {
    setServerError('');

    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Login failed. Please check your details.',
      );
    }
  };

  return (
    <AuthLayout eyebrow="Login To Continue" title="Login">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          autoComplete="email"
          error={errors.email}
          icon={Mail}
          label="Email / Mobile"
          placeholder="Email or mobile"
          registration={register('email')}
        />

        <PasswordInput
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          placeholder="Password"
          registration={register('password')}
        />

        <button className="link-button" type="button">
          Forgot Password?
        </button>

        {serverError && <p className="alert error-alert">{serverError}</p>}
        {successMessage && <p className="alert success-alert">{successMessage}</p>}

        <PrimaryButton isLoading={isSubmitting} type="submit">
          Login
        </PrimaryButton>

        <div className="divider">
          <span />
          <small>Or</small>
          <span />
        </div>

        <div className="auth-switch">
          <span>Create New Account</span>
          <Link className="secondary-button" to="/register">
            Sign Up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
