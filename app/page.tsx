import './globals.css';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';
import styles from './page.module.css';

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
      <div className="flex flex-col justify-center items-center gap-4 min-h-[91vh] min-w-full bg-gradient-to-r from-[#c7b198] to-[#e9e9e9] text-[#3b3d3f]">
        {user ? (
          <div>.</div>
        ) : (
          <>
            <h1 className="text-xl font-extrabold">Let your buddy sweat </h1>
            <div
              className={`${styles.pictureDiv} bg-no-repeat bg-contain h-[26rem] w-[16rem]`}
              style={{ backgroundImage: 'url(/landing.jpg)' }}
              // alt="Landing page"
            />
            <div className="flex flex-col justify-center items-center gap-8">
              {' '}
              <button className="text-[#3b3d3f] cursor-pointer rounded-lg font-semibold mx-5 py-2 shadow-md transition duration-300 bg-[#f5f5f5] border border-[#3b3d3f] hover:bg-[#4a4c4e] hover:shadow-lg text-white">
                <span className={styles.linkText}>
                  <Link
                    href="/register"
                    className="w-[12rem] text-center text-blue-500 hover:text-blue-700"
                  >
                    Register
                  </Link>
                </span>
              </button>
              <button className="text-white cursor-pointer rounded-lg font-semibold mx-4 py-2 shadow-md transition duration-300 bg-[#3b3d3f] hover:bg-[#4a4c4e] hover:shadow-lg">
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
