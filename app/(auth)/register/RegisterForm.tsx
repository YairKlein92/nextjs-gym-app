'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../utils/validation';
import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';

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
        const data: RegisterResponseBodyPost = await response.json();
        console.log(data);
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
          // type="password"
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
