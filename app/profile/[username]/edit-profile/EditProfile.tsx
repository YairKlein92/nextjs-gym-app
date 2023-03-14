'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getUserByUsername } from '../../../../database/users';
import { getSafeReturnToPath } from '../../../../utils/validation';
import { UpdateProfileResponseBodyPost } from '../../../api/users/[userId]/route';
import styles from './page.module.scss';

export default function EditProfile(props) {
  const user = props.user;
  console.log(user);
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

  // validation to ensure that required fields are filled out
  const isFormValid = () => {
    if (!username || !mail || !age || !mobile || !favouriteGym) {
      setErrors([{ message: 'All fields are required.' }]);
      return false;
    }
    return true;
  };

  const userData = {
    username: username,
    mail: mail,
    age: age,
    mobile: mobile,
    favouriteGym: favouriteGym,
    isShredding: isShredding,
    isBulking: isBulking,
    isExperienced: isExperienced,
  };
  console.log('userData', userData);
  return (
    <div className={styles.mainDiv}>
      <form
        className={styles.form}
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          if (!isFormValid()) {
            return;
          }

          await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Response was not ok');
              }
              console.log(response);
              return response.json();
            })
            .then((data) => {
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
            })
            .catch((err) => {
              console.error(err);
            });
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
