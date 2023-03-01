'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { RegisterResponseBody } from '../../api/(auth)/register/route';

// import styles from './page.module.scss';

export default function LoginForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const data: RegisterResponseBody = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }

        if (
          props.returnTo &&
          !Array.isArray(props.returnTo) &&
          // checking that the returnTo is a valid path in your application and is not going to a different domain
          /^\/[a-zA-Z0-9-?=/]*$/.test(props.returnTo)
        ) {
          router.push(props.returnTo);
          return;
        }

        router.push(`/profile/${data.user.username}`);

        errors.map((error) => (
          <div key={`error-${error.message}`}>Error: {error.message}</div>
        ));
      }}
    >
      <label htmlFor="username">
        Username:
        <input
          onChange={(event) => {
            setUsername(event.currentTarget.value);
          }}
        />
      </label>
      <label htmlFor="password">
        Password:
        <input
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
          type="password"
        />
      </label>
      <button>Login</button>
    </form>
  );
}
