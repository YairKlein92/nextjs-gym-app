import './globals.css';
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
            {/* <div className={styles.pictureDiv}>h</div> */}
            <img
              src="/landing.jpg"
              alt="Landing page"
              className={styles.pictureDiv}
            />
            <div className={styles.linkDiv}>
              <button className={styles.buttonLog}>
                <span className={styles.linkText}>
                  <Link
                    href={{ pathname: '/register' }}
                    className={styles.link}
                  >
                    Register
                  </Link>
                </span>
              </button>

              <button className={styles.buttonReg}>
                <span className={styles.linkText}>
                  <Link href={{ pathname: '/login' }} className={styles.link}>
                    Login
                  </Link>
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
