import { z } from 'zod'
import { messageSchema } from './socket.shemas'

// Define route patterns with parameters
export const API_ROUTE_PATTERNS = {
  '/api/v1/users/me': '/api/v1/users/me',
  '/api/v1/users/me/profile': '/api/v1/users/me/profile',
  '/api/v1/messages/:id': '/api/v1/messages/:id',
  '/api/v1/users/:roomId/messages': '/api/v1/users/:id/messages',
} as const

export const API_ROUTE_PARAMS = {
  '/api/v1/users/me': z.object({}),
  '/api/v1/users/me/profile': z.object({}),
  '/api/v1/messages/:id': z.object({
    id: z.string(),
  }),
  '/api/v1/users/:roomId/messages': z.object({
    roomId: z.string(),
  }),
} as const satisfies Record<TApiRoutes, z.ZodType>

// Helper function to build route with params
export function buildRoute(
  pattern: keyof typeof API_ROUTE_PATTERNS,
  params?: z.infer<(typeof API_ROUTE_PARAMS)[TApiRoutes]>
) {
  let route = API_ROUTE_PATTERNS[pattern] as string
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`:${key}`, value)
    })
  }
  return route as TApiRoutes
}

export type TApiRoutes = keyof typeof API_ROUTE_PATTERNS

export const API_ROUTES_RESPONSE_SCHEMAS = {
  '/api/v1/users/me': z.object({
    id: z.string(),
    email: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  '/api/v1/users/me/profile': z.object({
    id: z.string(),
    someField: z.string(),
  }),
  '/api/v1/messages/:id': z.array(messageSchema),
  '/api/v1/users/:roomId/messages': z.array(messageSchema),
} satisfies Record<TApiRoutes, z.ZodType>
