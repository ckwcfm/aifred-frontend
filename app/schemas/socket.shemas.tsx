import { z } from 'zod'

export const messageContentTypes = [
  'text',
  'image',
  'audio',
  'video',
  'form',
] as const

export const messageContentTypesSchema = z.enum(messageContentTypes)

export const messageStatuses = ['pending', 'confirmed'] as const

export const messageStatusesSchema = z.enum(messageStatuses)

export const messageSchema = z.object({
  roomId: z.string(),
  content: z.string(),
  contentType: messageContentTypesSchema,
  senderId: z.string(),
  status: z.enum(['pending', 'confirmed']),
  randomId: z.string().default(crypto.randomUUID()),
  createdAt: z.date().optional(),
})

export type TMessage = z.infer<typeof messageSchema>
