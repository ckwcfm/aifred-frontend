import { PASSWORD_RULE } from '~/constants/auth.constants'
import { z } from 'zod'

// Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
)

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => passwordValidation.test(data.password), {
    message: PASSWORD_RULE,
    path: ['password'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password do not match',
    path: ['password'],
  })

export const authErrorSchema = z.object({
  message: z.string(),
})

export const loginResponseSchema = z.object({
  accessToken: z.string().jwt(),
})

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().jwt(),
})
