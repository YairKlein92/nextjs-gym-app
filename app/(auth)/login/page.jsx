import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }) {
  // Check if I have a valid session
  const returnTo = searchParams?.returnTo ?? '/'; // Default to home if null

  const sessionTokenCookie = (await cookies()).get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // If session exists, redirect to home
  if (session) {
    redirect('/');
  }

  // If no valid session, render login form
  return <LoginForm returnTo={returnTo} />;
}
