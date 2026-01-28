export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: 'auth_token',
  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: process.env.NODE_ENV === 'prod' ? 'strict' as const : 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
};
