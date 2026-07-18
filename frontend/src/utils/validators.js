import { z } from 'zod';

const phoneRegex = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email or mobile is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone is required')
      .regex(phoneRegex, 'Enter a valid 10-digit phone number'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    companyCode: z.string().trim().min(1, 'Company code is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    profileImage: z
      .any()
      .refine((files) => files?.length > 0, 'Profile image is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
