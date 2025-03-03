'use client';
import '../../../app/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Gym } from '../../../database/gyms';
import { User, Users } from '../../../database/users';
import Matches from './components/Matches';
import Preferences from './components/Preferences';
import ProfileNavBar from './components/ProfileNavBar';
import UserHeader from './components/UserHeader';

export type Props = {
  user: User;
  users: Users;
  favouriteGym: Gym;
  pendingRequests: any;
  matchCount: number;
  matchArray: any;
};

export default function ProfilePage(props: Props) {
  const { user, users, favouriteGym, pendingRequests, matchCount, matchArray } =
    props;
  console.log(matchArray);
  const [isShredding, setIsShredding] = useState(false);
  const [isBulking, setIsBulking] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [potentialBuddies, setPotentialBuddies] = useState(
    users.filter((buddy: User) => buddy.id !== user.id),
  );
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  useEffect(() => {
    const filteredBuddies = users.filter((buddy: User) => {
      if (buddy.id === user.id) return false;
      return (
        (isShredding && buddy.isShredding) ||
        (isBulking && buddy.isBulking) ||
        (isExperienced && buddy.isExperienced)
      );
    });
    setPotentialBuddies(filteredBuddies);
  }, [isBulking, isShredding, isExperienced, users, user.id]);
  const showMatchesHandler = async () => {
    matchArray.map((match: any) => {
      setIsMatchVisible(!isMatchVisible);
    });
  };
  return (
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] !p-8 rounded-lg shadow-xl h-170 w-full animate-fade-in-down">
      {/* UserHeader.tsx  */}
      <UserHeader
        profilePicture={user.profilePicture}
        username={user.username}
        age={user.age}
      />
      {/* ProfilNavBar.tsx */}
      <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'contact' && (
        <Matches
          matchCount={matchCount}
          matchArray={matchArray}
          pendingRequests={pendingRequests}
        />
      )}
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Change Password Button */}
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">
              Account Security
            </h3>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold !py-2 !px-4 rounded-lg transition duration-300">
              {/* <IoMdSettings className="inline mr-2" /> */}
              Edit data
            </button>
          </div>
        </div>
      )}
      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Preferences
          isShredding={isShredding}
          setIsShredding={setIsShredding}
          isBulking={isBulking}
          setIsBulking={setIsBulking}
          isExperienced={isExperienced}
          setIsExperienced={setIsExperienced}
          potentialBuddies={potentialBuddies}
          user={user}
        />
      )}{' '}
    </div>
  );
}
