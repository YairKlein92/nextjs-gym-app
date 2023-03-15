import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';
import styles from './page.module.scss';

export default async function Home() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  // 2. validate that session
  // 3. get the user profile matching the session
  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);
  return (
    <div className={styles.head}>
      <div className={styles.mainDiv}>
        {user ? (
          <div>.</div>
        ) : (
          <>
            <Link href={{ pathname: '/register' }}>
              <img src="/register.png" alt="Registration" />
            </Link>
            <Link href={{ pathname: '/login' }}>
              {' '}
              <img src="/login.png" alt="Login" />{' '}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
