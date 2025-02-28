'use client';

// import bcrypt from 'bcrypt';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
import { getSafeReturnToPath } from '../../../utils/validation';
// import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';
import styles from './page.module.scss';

export default function RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [age, setAge] = useState(0);
  const [mobile, setMobile] = useState('');
  const [isShredding, setIsShredding] = useState(Boolean(false));
  const [isBulking, setIsBulking] = useState(Boolean(false));
  const [isExperienced, setIsExperienced] = useState(Boolean(false));
  const [favouriteGym, setFavouriteGym] = useState(1);
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  // const [profilePicture, setProfilePicture] = useState();
  const [errors, setErrors] = useState([]);
  // const [errors, setErrors] = useState<{ message }[]>([]);
  const router = useRouter();
  // const fileInputRef = (useRef < HTMLInputElement) | (null > null);
  const handleShreddingChange = () => {
    setIsShredding(!isShredding);
    setIsBulking(false);
  };

  const handleBulkingChange = () => {
    setIsBulking(!isBulking);
    setIsShredding(false);
  };
  // const handleOnChange = (event: React.ChangeEvent<HTMLFormElement>) => {
  //   const reader = new FileReader();

  //   reader.onload = (onLoadEvent) => {
  //     setImageSrc(onLoadEvent.target.result);
  //     setUploadData(undefined);
  //   };

  //   reader.readAsDataURL(event.target.files[0]);
  // };
  const handleOnChange = (event) => {
    // : React.ChangeEvent<HTMLInputElement>
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result); // as strin
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setImageSrc(null);
    }
  };
  // console.log(await bcrypt.hash('abc', 12));

  return (
    <div className={styles.mainDiv}>
      <form
        className={styles.form}
        onChange={(event) => {
          handleOnChange(event);
        }}
        //  ONSUBMIT

        onSubmit={async (event) => {
          event.preventDefault();
          // FIRST ACTION - SETTING THE URL LINK
          const form = event.currentTarget;
          const fileInput = Array.from(form.elements)
            .filter(
              (element) =>
                element instanceof HTMLInputElement && element.type === 'file',
            )
            .pop(); // as HTMLInputElement | undefined;
          if (fileInput) {
            const formData = new FormData();
            if (fileInput.files !== null) {
              for (const file of fileInput.files) {
                formData.append('file', file);
              }
            }

            formData.append('upload_preset', 'my-uploads');

            const dataPicture = await fetch(
              'https://api.cloudinary.com/v1_1/dvbgjm0xm/image/upload',
              {
                method: 'POST',
                body: formData,
              },
            ).then((response) => response.json());

            setImageSrc(dataPicture.secure_url);
            setUploadData(dataPicture);

            // setProfilePicture(dataPicture.secure_url);

            // SECOND ACTION - REGISTERING

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
                profilePicture: dataPicture.secure_url || '/public/profile.png',
              }),
            });
            const data = await response.json(); // : RegisterResponseBodyPost
            // const userId = data;
            console.log('data: ', data);
            if ('errors' in data) {
              // Show error message using react-hot-toast
              data.errors.forEach((error) => {
                console.error(error.message);
              });
              return;
            }
            // new stuff
            // const responseGym = await fetch('/api/registerGym', {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     userId,
            //     favouriteGym,
            //   }),
            // });
            // const dataGym = await responseGym.json(); // : RegisterResponseBodyPost
            // if ('errors' in dataGym) {
            //   // Show error message using react-hot-toast
            //   data.errors.forEach((error) => {
            //     console.error(error.message);
            //   });
            //   return;
            // }

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
          } // end of if(fileInput)
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
            className={`${styles.checkboxLabel} ${
              isShredding ? styles.checked : ''
            }`}
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
            className={`${styles.checkboxLabel} ${
              isBulking ? styles.checked : ''
            }`}
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
          className={`${styles.checkboxLabel} ${
            isExperienced ? styles.checked : ''
          }`}
        >
          experienced
        </label>
        <input
          checked={isExperienced}
          className={styles.checkbox}
          id="experienced"
          onChange={() => {
            setIsExperienced(Boolean(!isExperienced));
          }}
          type="checkbox"
        />
        <label htmlFor="picture">Profile picture</label>
        <input id="picture" type="file" name="file" />
        <div>
          <button className={`${styles.button} ${styles.buttonReg}`}>
            Register
          </button>
        </div>
        <div>
          Already have an account?
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
