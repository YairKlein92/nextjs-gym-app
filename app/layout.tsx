import './globals.css';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getAnsweredMatchRequestById } from '../database/matches';
import { getUserBySessionToken } from '../database/users';

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
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');

  // 2. validate that session
  // 3. get the user profile matching the session
  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  // if user is not undefined, the person is logged in
  // if user is undefined, the person is logged out
  // let matches = [];

  // if (user) {
  //   matches = await getAnsweredMatchRequestById(user.id);
  // }

  return (
    <html lang="en">
      <head />
      <body className="bg-gradient-to-r from-[#c7b198] to-[#e9e9e9]">
        <header className="w-full py-3 px-4 md:px-6 lg:px-12">
          <nav className="flex justify-between items-center">
            {user ? (
              <div className="flex items-center gap-8">
                <Link href={`/profile/${user.username}`}>
                  <img
                    src="/profile.png"
                    alt="Back to your profile"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                  />
                </Link>
                <div className="relative">
                  <Link
                    href={{ pathname: `/profile/${user.username}/matches` }}
                    className="flex items-center gap-1"
                  >
                    <img
                      src="/matches.png"
                      alt="See your matches"
                      height={24}
                      width={24}
                      className="cursor-pointer"
                    />
                  </Link>
                  {/* <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs px-2 py-1">
                    {matches.length}
                  </span> */}
                </div>

                <div className="text-lg font-bold">Hi, {user.username}!</div>
                <Link
                  href={{ pathname: `/profile/${user.username}/edit-profile` }}
                  className="flex items-center gap-1"
                >
                  <img
                    src="/edit.png"
                    alt="Edit profile"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                  />
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center gap-1"
                  prefetch={false}
                >
                  <img
                    src="/logout.png"
                    alt="Logout"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                  />
                </Link>
              </div>
            ) : (
              <div className="text-center">Please log in</div>
            )}
          </nav>
        </header>

        <main>{props.children}</main>
      </body>
    </html>
  );
}
