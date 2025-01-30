import { loginSchema, registerSchema } from '~/schemas/auth.schemas'
import { credentialSchema } from '~/schemas/user.schemas'
import { z } from 'zod'

export type TLogin = z.infer<typeof loginSchema>
export type TRegister = z.infer<typeof registerSchema>
export type TCredential = z.infer<typeof credentialSchema>

export type TAuthService = {
  onRegister: (input: TRegister) => Promise<TCredential>
  onLogin: (input: TLogin) => Promise<TCredential>
  onRefreshToken: (input: string) => Promise<TCredential>
}
