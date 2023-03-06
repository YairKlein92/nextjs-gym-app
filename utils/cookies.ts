import cookie from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24; // 1 day
  return cookie.serialize('sessionToken', token, {
    maxAge: maxAge,
    // for internet explorer and older browsers
    expires: new Date(Date.now() + maxAge * 1000), // 1 day in ms
    httpOnly: true,
    secure: isProduction,
    path: '/', // for all routes
    sameSite: 'lax',
  });
}
