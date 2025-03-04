import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getGyms } from '../../../database/gyms';
import { getValidSessionByToken } from '../../../database/sessions';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({ params }) {
  // Fetch available gyms
  const gyms = await getGyms();

  const sessionTokenCookie = (await cookies()).get('sessionToken');

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // If session exists, redirect to home
  if (session) {
    redirect('/');
  }

  return <RegisterForm returnTo={params.searchParams?.returnTo} gyms={gyms} />;
}
