import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, Phone, Upload, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';

function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [preview, setPreview] = useState('');

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      companyCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const profileImage = watch('profileImage');

  useEffect(() => {
    if (profileImage?.[0]) {
      const objectUrl = URL.createObjectURL(profileImage[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview('');
    return undefined;
  }, [profileImage]);

  const onSubmit = async (values) => {
    setServerError('');

    try {
      await registerUser(values);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully. Please log in.' },
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Registration failed. Please try again.',
      );
    }
  };

  return (
    <AuthLayout eyebrow="Create Account" title="Sign Up">
      <form className="auth-form register-form" onSubmit={handleSubmit(onSubmit)}>
        <button className="google-button" type="button">
          <span aria-hidden="true">G</span>
          Sign up with Google
        </button>

        <div className="divider">
          <span />
          <small>Or create with email</small>
          <span />
        </div>

        <label className="avatar-upload">
          <input accept="image/*" type="file" {...register('profileImage')} />
          <span className="avatar-preview">
            {preview ? <img alt="Profile preview" src={preview} /> : <Upload size={24} />}
          </span>
          <strong>Upload profile photo</strong>
        </label>
        {errors.profileImage && (
          <small className="error-text">{errors.profileImage.message}</small>
        )}

        <div className="two-column">
          <InputField
            error={errors.firstName}
            icon={UserRound}
            label="First Name"
            placeholder="First name"
            registration={register('firstName')}
          />
          <InputField
            error={errors.lastName}
            icon={UserRound}
            label="Last Name"
            placeholder="Last name"
            registration={register('lastName')}
          />
        </div>

        <InputField
          error={errors.phone}
          icon={Phone}
          inputMode="tel"
          label="Phone"
          placeholder="10-digit phone number"
          registration={register('phone')}
        />

        <InputField
          autoComplete="email"
          error={errors.email}
          icon={Mail}
          label="Email"
          placeholder="Email address"
          registration={register('email')}
        />

        <InputField
          error={errors.companyCode}
          icon={Building2}
          label="Company Code"
          placeholder="Company code"
          registration={register('companyCode')}
        />

        <PasswordInput
          autoComplete="new-password"
          error={errors.password}
          label="Password"
          placeholder="Password"
          registration={register('password')}
        />

        <PasswordInput
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="Confirm Password"
          placeholder="Confirm password"
          registration={register('confirmPassword')}
        />

        {serverError && <p className="alert error-alert">{serverError}</p>}

        <PrimaryButton isLoading={isSubmitting} type="submit">
          Sign Up
        </PrimaryButton>

        <p className="auth-note">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
