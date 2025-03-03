'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../utils/validation';
import { LoginResponseBodyPost } from '../../api/(auth)/login/route';

export default function LoginForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md h-[80vh] flex flex-col justify-around p-12 rounded-lg shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl text-sky-400 font-extrabold">Login</h2>
          <p className="mt-4 text-lg text-gray-400">
            No more excuses. <br /> Get the support you need!
          </p>
        </div>

        {/* Error Handling */}
        {errors.length > 0 && (
          <div className="text-red-500 text-center">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>Error: {error.message}</div>
            ))}
          </div>
        )}

        {/* Login Form */}
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/login', {
              method: 'POST',
              body: JSON.stringify({ username, password }),
            });
            const data: LoginResponseBodyPost = await response.json();
            if ('errors' in data) {
              setErrors(data.errors);
              return;
            }
            const returnTo = getSafeReturnToPath(props.returnTo);
            if (returnTo) {
              router.push(returnTo);
              return;
            }
            router.replace(`/profile/${data.user.username}`);
            router.refresh();
          }}
        >
          {/* Username Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Username
            </label>
            <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-white border-0 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Password
            </label>
            <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white border-0 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-around w-full text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-sm border border-gray-600 bg-transparent focus:ring-green-400"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sky-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <div className="mt-4 flex items-center justify-center gap-x-2">
            <button
              className="font-semibold w-30 hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-sky-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
