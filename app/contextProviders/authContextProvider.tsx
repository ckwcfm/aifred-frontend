import { createContext, useContext, useEffect, useState } from 'react'
type AuthContextType = {
  accessToken: string | null
  setAccessToken: (accessToken: string | null) => void
  refreshToken: string | null
  setRefreshToken: (refreshToken: string | null) => void
  userId: string | null
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {},
  userId: null,
})

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
