// import './global.scss';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';
import styles from './layout.module.scss';

// import CookieBanner from './CookieBanner';
// import styles from './layout.module.scss';

export const metadata = {
  title: {
    default: 'Gym buddies',
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

type Props = {
  children: React.ReactNode;
};

export const dynamic = 'force-dynamic';
export default async function RootLayout(props: Props) {
  // 1. get the session token from the cookie
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  // 2. validate that session
  // 3. get the user profile matching the session
  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  // if user is not undefined, the person is logged in
  // if user is undefined, the person is logged out
  console.log('user in layout:', user);
  return (
    <html lang="en">
      <head />
      <body>
        <header>
          <nav>
            <div className={styles.positionCenter}>
              <div className={styles.headerDiv}>
                {user ? (
                  <div className={styles.headerLoggedIn}>
                    <Link href="/">
                      <img
                        src="/backArrow.png"
                        alt="back to homepage"
                        height={24}
                        width={24}
                      />
                    </Link>
                    <Link href="/profile/dd">
                      <img
                        src="/profile2.png"
                        alt="back to profile page"
                        height={24}
                        width={24}
                      />
                    </Link>
                    Hi, {user.username}!
                    <Link href="/logout" prefetch={false}>
                      logout
                    </Link>
                  </div>
                ) : (
                  <div className={styles.headerLoggedOut}>
                    <Link href="/register">register</Link> &nbsp;
                    <Link href="/login">login</Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
        {props.children}
        <footer></footer>
      </body>
    </html>
  );
}
