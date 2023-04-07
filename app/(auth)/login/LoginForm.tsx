'use client';
import '../../globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../utils/validation';
import { LoginResponseBodyPost } from '../../api/(auth)/login/route';
import styles from './page.module.scss';

export default function LoginForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  return (
    <div className={styles.mainDiv}>
      <form
        className={styles.form}
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
        {errors.map((error) => (
          <div key={`error-${error.message}`}>Error: {error.message}</div>
        ))}
        <div className={styles.loginTextDiv}>Login</div>
        <div className={styles.subText}>
          No more excuses
          <br /> Get the support you need!
        </div>
        <label>
          <input
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>
        <label>
          <input
            placeholder="password"
            value={password}
            type="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        <button className={`${styles.button} ${styles.buttonLog}`}>
          Login
        </button>
        <div>
          Don’t have an account?
          <Link href={{ pathname: '/register' }}>Register!</Link>
        </div>
      </form>
    </div>
  );
}
