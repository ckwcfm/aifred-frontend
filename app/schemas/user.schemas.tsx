import { z } from 'zod'
export const credentialSchema = z.object({
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
})
