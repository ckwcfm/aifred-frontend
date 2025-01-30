/**
 * Refresh Token Route
 *
 * This route handles token refresh operations for authentication. It exists because
 * the session cookies storing the access and refresh tokens are HTTP-only for security,
 * meaning they cannot be accessed directly by client-side JavaScript. This route acts
 * as a server-side intermediary to handle token refresh operations and set the new
 * tokens in HTTP-only cookies.
 *
 * Key features:
 * - Handles both GET (loader) and POST (action) requests for token refresh
 * - Securely manages HTTP-only cookies for tokens
 * - Provides redirect handling for authentication flows
 * - Implements error handling with session cleanup
 */

import { AuthService } from '~/services/AuthService'
import type { Route } from './+types/refresh-token'
import { data, redirect } from 'react-router'

import {
  destroySession,
  getSessionTokens,
  setSessionTokens,
} from '~/utilities/session.server'

// /**
//  * Loader function - Handles GET requests
//  * Used when a page refresh requires new tokens
//  *
//  * @param request - The incoming request object
//  * @returns Redirects to login or returns new tokens with updated session cookie
//  */
// export async function loader({ request }: Route.LoaderArgs) {
//   // must contain a redirect path in query
//   console.log('refresh token loader')
//   // get refresh token from cookie
//   const { refreshToken } = await getSessionTokens(request)

//   if (!refreshToken) {
//     return redirect('/auth/login')
//   }

//   // refresh token
//   const authService = AuthService()
//   const credentials = await authService.onRefreshToken(refreshToken)
//   const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
//     credentials

//   console.log('newAccessToken', newAccessToken)
//   console.log('newRefreshToken', newRefreshToken)

//   return data(
//     { accessToken: newAccessToken, refreshToken: newRefreshToken },
//     {
//       headers: {
//         'Set-Cookie': await setSessionTokens(request, {
//           accessToken: newAccessToken,
//           refreshToken: newRefreshToken,
//         }),
//       },
//     }
//   )
// }

/**
 * Action function - Handles POST requests
 * Used when the client-side code detects an expired token
 *
 * @param request - The incoming request object
 * @returns New tokens with updated session cookie or redirects to login on failure
 */
export async function action({ request }: Route.ActionArgs) {
  // must contain a redirect path in query
  try {
    console.log('DEBUG: (refresh-token/action) - line 46')

    // get refresh token from cookie
    const { refreshToken } = await getSessionTokens(request)

    if (!refreshToken) {
      return redirect('/auth/login')
    }
    // refresh token
    const authService = AuthService()
    const credentials = await authService.onRefreshToken(refreshToken)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      credentials

    return new Response(JSON.stringify({ accessToken: newAccessToken }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': await setSessionTokens(request, {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      },
    })
  } catch (error) {
    console.error('DEBUG: (refresh-token/action) - line 66', error)
    throw redirect('/auth/login', {
      headers: {
        'Set-Cookie': await destroySession(request),
      },
    })
  }
}
