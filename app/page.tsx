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
      {/* <span className={styles.username}>Welcome {user && user.username} !</span> */}
      <div className={styles.mainDiv}>
        <Link href={{ pathname: '/register' }} className={styles.link}>
          Register
        </Link>
        <Link href={{ pathname: '/login' }} className={styles.link}>
          Login
        </Link>
        <Link
          href={{ pathname: '/logout' }}
          className={styles.link}
          prefetch={false}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
