'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { RegisterResponseBody } from '../../api/(auth)/register/route';

// import styles from './page.module.scss';

export default function RegisterForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState(0);
  const [mobile, setMobile] = useState('');
  const [isShredding, setIsShredding] = useState(Boolean(false));
  const [isBulking, setIsBulking] = useState(Boolean(false));
  const [isExperienced, setIsExperienced] = useState(Boolean(false));
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
            age,
            mobile,
            isShredding,
            isBulking,
            isExperienced,
          }),
        });
        const data: RegisterResponseBody = await response.json();
        console.log(data);
        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }

        if (
          props.returnTo &&
          !Array.isArray(props.returnTo) &&
          // This is checking that the return to is a valid path in your application and not going to a different domain
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
      <label htmlFor="mail">
        Mail:
        <input
          onChange={(event) => {
            setMail(event.currentTarget.value);
          }}
        />
      </label>
      <label htmlFor="age">
        Age:
        <input
          onChange={(event) => {
            setAge(Number(event.currentTarget.value));
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
            setIsShredding(Boolean(!isShredding));
          }}
          type="checkbox"
        />
      </label>
      <label htmlFor="bulking">
        Are you bulking?
        <input
          onChange={() => {
            setIsBulking(Boolean(!isBulking));
          }}
          type="checkbox"
        />
      </label>
      <label htmlFor="experienced">
        Are you experienced?
        <input
          onChange={() => {
            setIsExperienced(Boolean(!isExperienced));
          }}
          type="checkbox"
        />
      </label>
      <button>Register</button>
      {errors.map((error) => (
        <div key={`error-${error.message}`}>Error: {error.message}</div>
      ))}
    </form>
  );
}
