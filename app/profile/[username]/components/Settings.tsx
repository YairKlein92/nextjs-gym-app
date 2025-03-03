import Link from 'next/link';
// Settings.tsx
import React from 'react';
import { User } from '../../../../database/users';

type SettingsProps = {
  user: User;
};
export default function Settings({ user }: SettingsProps) {
  return (
    <div className="space-y-4">
      {/* Change Password Button */}
      <div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          Account Security
        </h3>
        <Link
          href={{ pathname: `/profile/${user.username}/edit-profile` }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold !py-2 !px-4 rounded-lg transition duration-300"
        >
          {/* <IoMdSettings className="inline mr-2" /> */}
          Edit data
        </Link>
      </div>
    </div>
  );
}
