import './globals.css';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getAnsweredMatchRequestById } from '../database/matches';
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

export type Props = {
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

  async function numberOfMatches() {
    if (user) {
      const matches = await getAnsweredMatchRequestById(user.id);
      return matches;
    }
  }
  const matches = await numberOfMatches();

  return (
    <html lang="en">
      <head />
      <body>
        <header>
          <nav>
            {}
            {user ? (
              <div className={styles.positionCenter}>
                {/* <Link href="/">
                  <img
                    src="/backArrow.png"
                    alt="Back to the homepage"
                    height={24}
                    width={24}
                  />
                </Link> */}
                <Link href={`/profile/${user.username}`}>
                  <img
                    src="/profile.png"
                    alt="Back to your profile"
                    height={24}
                    width={24}
                  />
                </Link>
                <div>
                  <Link
                    href={{ pathname: `/profile/${user.username}/matches` }}
                  >
                    <img
                      src="/matches.png"
                      alt="See your matches"
                      height={24}
                      width={24}
                    />
                  </Link>
                  <span className={styles.matchNumber}>
                    {[matches].length - 1}
                  </span>
                </div>

                <div className={styles.greetingUser}> Hi {user.username}!</div>
                <Link
                  href={{ pathname: `/profile/${user.username}/edit-profile` }}
                >
                  <img
                    src="/edit.png"
                    alt="back to homepage"
                    height={24}
                    width={24}
                  />
                </Link>
                <Link
                  href={{ pathname: '/logout' }}
                  className={styles.link}
                  prefetch={false}
                >
                  <img
                    src="/logout.png"
                    alt="back to homepage"
                    height={24}
                    width={24}
                  />
                </Link>
              </div>
            ) : (
              <div className={styles.positionCenter}>&nbsp;</div>
            )}
          </nav>
        </header>

        {props.children}

        {/* <footer>
        </footer> */}
      </body>
    </html>
  );
}
