import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserBySessionToken } from '../../../../../database/users';

// GET function to handle fetching user details
export async function GET(request, { params }) {
  // Check if the request is a NextRequest instance
  if (!(request instanceof NextRequest)) {
    return NextResponse.json(
      { errors: [{ message: 'Invalid request type' }] },
      { status: 400 },
    );
  }

  // Get the session token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken');

  // If no token is found, return an error
  if (!token) {
    return NextResponse.json(
      { errors: [{ message: 'Unauthorized access - No session token found' }] },
      { status: 401 },
    );
  }

  // Retrieve the user by session token
  const user = await getUserBySessionToken(token.value);

  if (!user || user.id !== parseInt(params.userId, 10)) {
    return NextResponse.json(
      { error: 'User not found or unauthorized' },
      { status: 404 },
    );
  }

  // Return sanitized user data (excluding sensitive fields)
  const { passwordHash, csrfSecret, ...safeUser } = user;

  return NextResponse.json({ user: safeUser }, { status: 200 });
}
