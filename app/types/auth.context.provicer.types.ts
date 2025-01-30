import {
  type TLogin,
  type TRegister,
  type TAuthService,
  type TCredential,
} from '~/types/auth.service.types'

export type TAuthConext = {
  user: TCredential | undefined
  error: string
  onRegister: (input: TRegister) => void
  onLogin: (input: TLogin) => Promise<void>
  onLogout: () => void
}

export type TAuthProviderProps = {
  service: TAuthService
  children: React.ReactNode
}
