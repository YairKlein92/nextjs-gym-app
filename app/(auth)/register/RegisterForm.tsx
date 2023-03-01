'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { RegisterResponseBody } from '../../api/(auth)/register/route';

// import styles from './page.module.scss';

export default function RegisterForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [mobile, setMobile] = useState('');
  const [shredding, setShredding] = useState(false);
  const [bulking, setBulking] = useState(false);
  const [experienced, setExperienced] = useState(false);
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
            mail,
            mobile,
            shredding,
            bulking,
            experienced,
          }),
        });
        const data: RegisterResponseBody = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }

        router.push(`/profile/${data.user.username}}`);

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
      <label htmlFor="mail">
        Mail:
        <input
          onChange={(event) => {
            setMail(event.currentTarget.value);
          }}
        />
      </label>
      <label htmlFor="mobile">
        Phone number:
        <input
          onChange={(event) => {
            setMobile(event.currentTarget.value);
          }}
        />
      </label>
      <label htmlFor="shredding">
        Are you shredding?
        <input
          onChange={() => {
            setShredding(!shredding);
          }}
          type="checkbox"
        />
      </label>
      <label htmlFor="bulking">
        Are you bulking?
        <input
          onChange={() => {
            setBulking(!bulking);
          }}
          type="checkbox"
        />
      </label>
      <label htmlFor="experienced">
        Are you experienced?
        <input
          onChange={() => {
            setExperienced(!experienced);
          }}
          type="checkbox"
        />
      </label>
      <button>Register</button>
    </form>
  );
}
