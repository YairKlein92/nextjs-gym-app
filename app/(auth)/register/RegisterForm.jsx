'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { User } from '../../../database/users';
import { getSafeReturnToPath } from '../../../utils/validation';

// type RegisterFormProps = {
//   username: string;
//   password: string;
//   mail: string;
//   age: number;
//   mobile: string;
//   isShredding: boolean;
//   isBulking: boolean;
//   isExperienced: boolean;
//   favouriteGym: string;
//   imageSrc: string;
//   uploadData: string;
//   errors: string;
// };
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
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const handleShreddingChange = () => {
    setIsShredding(!isShredding);
    setIsBulking(false);
  };

  const handleBulkingChange = () => {
    setIsBulking(!isBulking);
    setIsShredding(false);
  };

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(imageSrc);
        setImageSrc(e.target?.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setImageSrc(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md h-full p-12 flex flex-col rounded-lg shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center !mt-8 !mb-8">
          <h2 className="text-3xl text-sky-400 font-bold">Register</h2>
          <p className="mt-4 text-lg text-gray-400">
            Start your fitness journey with us!
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

        {/* Register Form */}
        <form
          className="flex flex-col items-center gap-4 w-full"
          onChange={(event) => handleOnChange(event)}
          onSubmit={async (event) => {
            event.preventDefault();

            // Handle image upload
            const form = event.currentTarget;
            const fileInput = Array.from(form.elements)
              .filter(
                (element) =>
                  element instanceof HTMLInputElement &&
                  element.type === 'file',
              )
              .pop();
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
              console.log(uploadData);
              setUploadData(dataPicture);

              // Registering
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
                  profilePicture:
                    dataPicture.secure_url || '/public/profile.png',
                }),
              });
              const data = await response.json();
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
            }
          }}
        >
          {/* Username Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Username{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Password Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Password{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Email Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Email{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Age Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Age{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  placeholder="14" // Set the placeholder value to 14
                  value={age}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow valid numbers or empty string
                    if (!value || /^\d+$/.test(value)) {
                      setAge(Number(value)); // Update age if it's a valid number or empty
                    }
                  }}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                  min="14"
                  required
                />
              </div>
            </label>

            {/* Display warning if age is less than 14 */}
            {age < 14 && age !== 0 && (
              <div className="text-red-500 text-xs mt-1">
                You must be at least 14 years old to register.
              </div>
            )}

            {/* Display error if the input is NaN (not a number) */}
            {isNaN(age) && age !== 0 && (
              <div className="text-red-500 text-xs mt-1">
                You must type a number.
              </div>
            )}
          </div>

          {/* Mobile Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Phone number{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Gym Select */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Gym{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <select
                  id="favourite-gym"
                  value={favouriteGym}
                  onChange={(event) =>
                    setFavouriteGym(Number(event.target.value))
                  }
                  className="w-full bg-transparent text-gray-400 border-0 focus:outline-none text-sm h-8"
                >
                  {props.gyms.map((gym) => (
                    <option
                      className="bg-black"
                      key={`user-${gym.id}`}
                      value={gym.id}
                    >
                      {gym.gymName}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {/* Goal Options */}
          <div className="flex gap-4 justify-around w-full mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-sm border border-gray-600 bg-transparent focus:ring-green-400"
                checked={isShredding}
                onChange={handleShreddingChange}
              />
              Shredding
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-sm border border-gray-600 bg-transparent focus:ring-green-400"
                checked={isBulking}
                onChange={handleBulkingChange}
              />
              Bulking
            </label>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded-sm border border-gray-600 bg-transparent focus:ring-green-400"
              checked={isExperienced}
              onChange={() => setIsExperienced(!isExperienced)}
            />
            Experienced
          </label>
          {/* Profile Picture */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Profile Picture{' '}
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  id="picture"
                  type="file"
                  name="file"
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm"
                />
              </div>
            </label>
          </div>

          {/* Register Button */}
          <div className=" !mb-8 flex items-center justify-center gap-x-2">
            <button className="font-semibold w-30 hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2">
              Register
            </button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="mt-4 !mb-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-400 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
