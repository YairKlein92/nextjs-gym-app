import React from 'react';

type UserHeaderProps = {
  profilePicture: string;
  username: string;
  age: number;
};

export default function UserHeader({
  profilePicture,
  username,
  age,
}: UserHeaderProps) {
  return (
    <div className="flex justify-around items-center !mb-6">
      <img
        src={profilePicture}
        alt={username}
        className="w-24 h-24 object-cover rounded-full border-4 border-blue-200 hover:border-blue-300 transition-all duration-300"
      />
      <div className="ml-4">
        <h2 className="text-2xl font-bold text-gray-200">{username}</h2>
        <p className="text-gray-400 mt-1">{age} years old</p>
      </div>
    </div>
  );
}
