'use client';

// import bcrypt from 'bcrypt';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../utils/validation';
import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';
import styles from './page.module.scss';

// import styles from './page.module.scss';
interface RegisterFormProps {
  gyms: { id: number; gymName: string }[];
  returnTo?: string | string[] | undefined;
}
export default function RegisterForm(props: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState(0);
  const [mobile, setMobile] = useState('');
  const [isShredding, setIsShredding] = useState(Boolean(false));
  const [isBulking, setIsBulking] = useState(Boolean(false));
  const [isExperienced, setIsExperienced] = useState(Boolean(false));
  const [favouriteGym, setFavouriteGym] = useState('FitInn Johnstrasse');

  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  const handleShreddingChange = () => {
    setIsShredding(!isShredding);
    setIsBulking(false);
  };

  const handleBulkingChange = () => {
    setIsBulking(!isBulking);
    setIsShredding(false);
  };
  // console.log(await bcrypt.hash('abc', 12));

  return (
    <div className={styles.mainDiv}>
      <form
        className={styles.form}
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
              favouriteGym,
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
        <div className={styles.registerTextDiv}>Register</div>
        <label htmlFor="username">
          <input
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="password">
          <input
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            type="password"
          />
        </label>
        <label htmlFor="mail">
          <input
            placeholder="Mail"
            onChange={(event) => {
              setMail(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="age">
          <input
            placeholder="Age"
            onChange={(event) => {
              setAge(Number(event.currentTarget.value));
            }}
          />
        </label>
        <label htmlFor="mobile">
          <input
            placeholder="Phone number"
            onChange={(event) => {
              setMobile(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="favourite-gym-select">
          Gym:
          <select
            id="favourite-gym"
            value={favouriteGym}
            onChange={(event) => setFavouriteGym(event.currentTarget.value)}
          >
            {props.gyms.map((gym) => (
              <option key={`user-${gym.id}`} value={gym.id}>
                {gym.gymName}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.goalDiv}>
          <label
            htmlFor="shredding"
            className={styles.checkboxLabel}
            style={{ color: isShredding ? 'red' : 'inherit' }}
          >
            shredding
          </label>
          <input
            checked={isShredding}
            className={styles.checkbox}
            id="shredding"
            onChange={handleShreddingChange}
            type="checkbox"
          />
          <label
            htmlFor="bulking"
            className={styles.checkboxLabel}
            style={{ color: isBulking ? 'red' : 'inherit' }}
          >
            bulking
          </label>
          <input
            checked={isBulking}
            className={styles.checkbox}
            id="bulking"
            onChange={handleBulkingChange}
            type="checkbox"
          />
        </div>
        <label
          htmlFor="experienced"
          className={styles.checkboxLabel}
          style={{ color: isExperienced ? 'red' : 'inherit' }}
        >
          experienced
        </label>{' '}
        <input
          checked={isExperienced}
          className={styles.checkbox}
          id="experienced"
          onChange={() => {
            setIsExperienced(Boolean(!isExperienced));
          }}
          type="checkbox"
        />
        <button className={`${styles.button} ${styles.buttonReg}`}>
          Register
        </button>
        <div>
          Already have an account?{' '}
          <Link href={{ pathname: '/login' }} as="/login">
            Log in!
          </Link>
        </div>
        {errors.map((error) => (
          <div key={`error-${error.message}`}>Error: {error.message}</div>
        ))}
      </form>
    </div>
  );
}
