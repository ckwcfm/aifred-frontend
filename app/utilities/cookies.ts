// import { createCookie } from 'react-router'

// export const refreshTokenCookie = createCookie('refreshToken', {
//   maxAge: 60 * 60 * 24 * 30,
//   httpOnly: true,
//   secure: true,
//   sameSite: 'lax',
//   path: '/',
// })

// export const accessTokenCookie = createCookie('accessToken', {
//   maxAge: 60 * 60 * 24 * 30,
//   httpOnly: true,
//   secure: true,
//   sameSite: 'lax',
//   path: '/',
// })

// export const userIdCookie = createCookie('userId', {
//   maxAge: 60 * 60 * 24 * 30,
//   httpOnly: true,
//   secure: true,
//   sameSite: 'lax',
//   path: '/',
// })

// export async function setRefreshToken(value: string) {
//   return await refreshTokenCookie.serialize(value)
// }

// export async function clearRefreshToken() {
//   return await refreshTokenCookie.serialize('', {
//     expires: new Date(0),
//     maxAge: 0,
//   })
// }

// export async function getRefreshToken(request: Request) {
//   const refreshToken = await refreshTokenCookie.parse(
//     request.headers.get('Cookie')
//   )
//   return refreshToken as string
// }
