'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../../utils/validation';

export default function EditProfile(props) {
  const user = props.user;
  const gyms = props.gyms;
  const gym = props.favouriteGym;

  const [username, setUsername] = useState(user.username);
  const [mail, setMail] = useState(user.mail);
  const [age, setAge] = useState(user.age);
  const [mobile, setMobile] = useState(user.mobile);
  const [isShredding, setIsShredding] = useState(Boolean(user.isShredding));
  const [isBulking, setIsBulking] = useState(Boolean(user.isBulking));
  const [isExperienced, setIsExperienced] = useState(
    Boolean(user.isExperienced),
  );
  const [favouriteGym, setFavouriteGym] = useState(gym.gymName);
  const profilePicture = user.profilePicture;
  const [errors, setErrors] = useState([{ message: 'Something went wrong!' }]);
  const router = useRouter();

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
    username,
    mail,
    age,
    mobile,
    favouriteGym,
    isShredding,
    isBulking,
    isExperienced,
    profilePicture,
  };

  return (
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-12 flex flex-col rounded-lg shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-sky-400 font-bold">Update Profile</h2>
          <p className="mt-4 text-lg text-gray-400">
            Update your information to keep your profile up to date!
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

        {/* Update Form */}
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={async (event) => {
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
                return response.json();
              })
              .then((data) => {
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
          {/* Username Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Username
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Email Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Email
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={mail}
                  onChange={(e) => setMail(e.currentTarget.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                />
              </div>
            </label>
          </div>

          {/* Age Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Age
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  value={age}
                  onChange={(e) => setAge(Number(e.currentTarget.value))}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                  min="14"
                  required
                  placeholder="Age"
                />
              </div>
            </label>
          </div>

          {/* Phone Number Input */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Phone number
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.currentTarget.value)}
                  className="w-full bg-transparent text-white border-0 focus:outline-none text-sm h-8"
                  placeholder="Phone number"
                />
              </div>
            </label>
          </div>

          {/* Gym Select */}
          <div className="w-60">
            <label className="text-xs font-medium text-gray-400">
              Favourite Gym
              <div className="group relative mt-1 rounded-lg border px-4 py-3 focus-within:border-sky-300 focus-within:ring focus-within:ring-sky-400/50 transition">
                <select
                  value={favouriteGym}
                  onChange={(event) =>
                    setFavouriteGym(event.currentTarget.value)
                  }
                  className="w-full bg-transparent text-gray-400 border-0 focus:outline-none text-sm h-8"
                >
                  {gyms.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.gymName}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg"
          >
            Update
          </button>
        </form>

        {/* Profile Picture Link */}
        <div className="mt-6 text-center">
          <div>
            Upload/Change a profile picture{' '}
            <Link
              href={`/profile/${user.username}/edit-profile/picture`}
              className="text-sky-400"
            >
              here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
