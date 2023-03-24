// import './globals.css';
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
            <div className={styles.mainText}>Let your buddy sweat </div>
            <div className={styles.subText}>
              {/* Connect with a gym buddy <br /> Get the support you need! */}
            </div>
            <div className={styles.linkDiv}>
              <Link href={{ pathname: '/register' }}>
                <button className={styles.buttonLog}>
                  <span className={styles.linkText}>Register</span>
                </button>
              </Link>
              <Link href={{ pathname: '/login' }}>
                <button className={styles.buttonReg}>
                  <span className={styles.linkText}>Login</span>
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
