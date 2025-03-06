import './globals.css';
import { cookies } from 'next/headers';
import Link from 'next/link';
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
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  return (
    <html lang="en">
      <head />
      <body className="bg-gradient-to-r from-[#c7b198] to-[#e9e9e9] min-h-screen">
        <header className="w-full bg-gradient-to-r from-[#111827] to-[#1F2937] text-white py-4 px-6 shadow-md sticky top-0 z-50">
          <nav className="flex justify-between items-center max-w-screen-xl mx-auto">
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="text-2xl font-extrabold text-sky-400 hover:text-sky-500 transition-colors"
              >
                Gym Buddies
              </Link>

              {/* Navigation for logged in users */}
              {user && (
                <div className="flex gap-6">
                  <Link
                    href={`/profile/${user.username}`}
                    className="text-lg font-medium text-white hover:text-sky-300 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href={`/profile/${user.username}/matches`}
                    className="text-lg font-medium text-white hover:text-sky-300 transition-colors"
                  >
                    Matches
                  </Link>
                  <Link
                    href={`/profile/${user.username}/edit-profile`}
                    className="text-lg font-medium text-white hover:text-sky-300 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-white">
                    Hi, {user.username}!
                  </span>
                  <Link
                    href="/logout"
                    className="text-lg font-medium text-white hover:text-red-400 transition-colors"
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-lg font-medium text-white hover:text-sky-300 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main>{props.children}</main>
      </body>
    </html>
  );
}
