import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserBySessionToken } from '../../../../../database/users';

// Return type annotation for the function
/**
 * @param {Object} params
 * @returns {NextResponse}
 */

export async function GET({ params }) {
  // Get session token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken');

  // Validate session and get user
  const user = token && (await getUserBySessionToken(token.value));

  if (!user || user.id !== parseInt(params.userId, 10)) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Return user data without passwordHash and csrfSecret
  const { passwordHash, csrfSecret, ...safeUser } = user;

  return NextResponse.json({ user: safeUser }, { status: 200 });
}
