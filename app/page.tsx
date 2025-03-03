import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');

  // Validate session and get the user profile
  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#111827] to-[#1F2937] text-white">
      <div className="flex flex-col justify-center items-center gap-6 px-6 sm:px-8 md:px-16 lg:px-24">
        {user ? (
          <div className="text-lg font-bold text-[#64FF00]">
            Welcome back, {user.username}!
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-sky-400 leading-tight">
              Find Your Gym Buddy <br /> Crush Your Fitness Goals
            </h1>
            {/* <div
              className="bg-no-repeat bg-center bg-cover h-[16rem] w-[11rem] sm:h-[30rem] sm:w-[20rem] lg:h-[35rem] lg:w-[25rem]"
              style={{ backgroundImage: 'url(/landing.jpg)' }}
            /> */}

            <div className="mt-4 flex items-center justify-center gap-6">
              <Link
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200 w-45"
                href="/register"
              >
                Register
              </Link>
              <button className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2 w-45">
                <Link href="/login">Log in</Link>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
