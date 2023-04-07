import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getGyms } from '../../../database/gyms';
import { getValidSessionByToken } from '../../../database/sessions';
import RegisterForm from './RegisterForm';

// type Props = { searchParams: { returnTo?: string | string[] } };

export default async function RegisterPage(props) {
  // check if i have a valid session
  const gyms = await getGyms();

  const sessionTokenCookie = cookies().get('sessionToken');

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // if yes redirect to home
  if (session) {
    redirect('/');
  }
  return <RegisterForm returnTo={props.searchParams.returnTo} gyms={gyms} />;
}
