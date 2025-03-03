'use client';
import '../../../app/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Gym } from '../../../database/gyms';
import { User, Users } from '../../../database/users';
import Matches from './components/Matches';
import Preferences from './components/Preferences'; // Adjust the import path accordingly
import ProfileNavBar from './components/ProfileNavBar';
import Settings from './components/Settings';
import UserHeader from './components/UserHeader';

export type Props = {
  user: User;
  users: Users;
  favouriteGym: Gym;
  pendingRequests: any;
  matchCount: number;
  matchArray: any[];
  pendingRequestsArray: any[];
};

export default function ProfilePage(props: Props) {
  const { user, users, favouriteGym, matchCount, pendingRequests, matchArray } =
    props;
  console.log('profile page user', user);
  const pendingRequestsArray = [pendingRequests];
  console.log('Profil page pendingRequestsArray', pendingRequestsArray);
  const [isShredding, setIsShredding] = useState(false);
  const [isBulking, setIsBulking] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [potentialBuddies, setPotentialBuddies] = useState(
    users.filter((buddy: User) => buddy.id !== user.id),
  );
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  // Filter potential buddies based on preferences (shredding, bulking, experienced)
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
      {/* UserHeader.tsx */}
      <UserHeader
        profilePicture={user.profilePicture}
        username={user.username}
        age={user.age}
      />

      {/* ProfileNavBar.tsx */}
      <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Matches Tab */}
      {activeTab === 'contact' && (
        <Matches
          user={user}
          matchArray={matchArray}
          pendingRequests={pendingRequests}
        />
      )}

      {/* Settings.tsx */}
      {activeTab === 'settings' && <Settings user={user} />}

      {/* Preferences.tsx */}
      {activeTab === 'preferences' && (
        <Preferences
          isShredding={isShredding}
          setIsShredding={setIsShredding}
          isBulking={isBulking}
          setIsBulking={setIsBulking}
          isExperienced={isExperienced}
          setIsExperienced={setIsExperienced}
          potentialBuddies={potentialBuddies}
          user={user} // Passing user object to link to "Potential Buddies" section
        />
      )}
    </div>
  );
}
