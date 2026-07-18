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

export const findRideSchema = z.object({
  pickupLocation: z.string().trim().min(2, 'Pickup location is required'),
  destination: z.string().trim().min(2, 'Destination is required'),
  travelDate: z.string().trim().min(1, 'Travel date is required'),
  travelTime: z.string().trim().min(1, 'Travel time is required'),
  numberOfSeats: z.coerce.number().min(1, 'At least 1 seat').max(8, 'Maximum 8 seats'),
  recurringRide: z.boolean().optional(),
});
