import { AuthService } from '~/services/AuthService'

export const loader = async (request: Request) => {
  const authService = AuthService()
  const refreshToken = request.headers.get('Authorization') || ''
  console.log('DEBUG: refreshToken', refreshToken)
  const accessToken = await authService.onRefreshToken(refreshToken)
  console.log('DEBUG: accessToken', accessToken)
  return null
}

export default function Test() {
  return <div>Test</div>
}
