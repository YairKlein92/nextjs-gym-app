'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getUserByUsername } from '../../../../database/users';
import { getSafeReturnToPath } from '../../../../utils/validation';
import { UpdateProfileResponseBodyPost } from '../../../api/update/route';
import styles from './page.module.scss';

export default function EditProfile(props) {
  const user = props.user;
  const gym = props.favouriteGym;
  const gyms = props.gyms;
  const [username, setUsername] = useState(user.username);
  const [mail, setMail] = useState(user.mail);
  const [age, setAge] = useState(user.age);
  const [mobile, setMobile] = useState(user.mobile);
  const [isShredding, setIsShredding] = useState(Boolean(user.isShredding));
  const [isBulking, setIsBulking] = useState(Boolean(user.isBulking));
  const [isExperienced, setIsExperienced] = useState(
    Boolean(user.isExperienced),
  );
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();
  const [favouriteGym, setFavouriteGym] = useState(gym.gymName);
  const handleShreddingChange = () => {
    setIsShredding(!isShredding);
    setIsBulking(false);
  };

  const handleBulkingChange = () => {
    setIsBulking(!isBulking);
    setIsShredding(false);
  };
  return (
    <div className={styles.mainDiv}>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();

          const response: any = await fetch('/api/update', {
            method: 'POST',
            body: JSON.stringify({
              username,
              mail,
              age,
              mobile,
              favouriteGym,
              isShredding,
              isBulking,
              isExperienced,
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error('Response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.error(err);
            });

          const data: UpdateProfileResponseBodyPost = await response.json();
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
        <div className={styles.registerTextDiv}>Update Profile</div>
        <label htmlFor="username">
          <input
            placeholder={user.username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="mail">
          <input
            placeholder={user.mail}
            onChange={(event) => {
              setMail(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="age">
          <input
            placeholder={user.age}
            onChange={(event) => {
              setAge(Number(event.currentTarget.value));
            }}
          />
        </label>
        <label htmlFor="mobile">
          <input
            placeholder={user.mobile}
            onChange={(event) => {
              setMobile(event.currentTarget.value);
            }}
          />
        </label>
        <select
          title="favourite-gym"
          id="favourite-gym"
          value={favouriteGym}
          onChange={(event) => setFavouriteGym(event.currentTarget.value)}
        >
          {gyms.map((g) => (
            <option key={`user-${g.id}`} value={g.id}>
              {g.gymName}
            </option>
          ))}
        </select>
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
          Update
        </button>
      </form>
    </div>
  );
}
