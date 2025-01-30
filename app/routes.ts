import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export default [
  layout('layouts/app-layout.tsx', [
    index('routes/home.tsx'),
    ...prefix('/auth', [
      layout('layouts/auth-layout.tsx', [
        route('login', 'routes/auth/login.tsx'),
        route('register', 'routes/auth/register.tsx'),
        route('refresh-token', 'routes/auth/refresh-token.tsx'),
      ]),
    ]),
    layout('layouts/protected-layout.tsx', [
      route('/protected', 'routes/protected.tsx'),
      ...prefix('/dashboard', [
        layout('layouts/dashboard-layout.tsx', [
          index('routes/dashboard/chat.tsx'),
          route('calendar', 'routes/dashboard/calendar.tsx'),
          route('photos', 'routes/dashboard/photos.tsx'),
          route('settings', 'routes/dashboard/settings.tsx'),
        ]),
      ]),
    ]),
    route('logout', 'routes/logout.tsx'),
  ]),
] satisfies RouteConfig
