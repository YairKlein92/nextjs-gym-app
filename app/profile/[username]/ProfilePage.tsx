'use client';
import '../../../app/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaFacebook, FaLinkedin, FaPhone, FaTwitter } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { Gym } from '../../../database/gyms';
import { User, Users } from '../../../database/users';

export type Props = {
  user: User;
  users: Users;
  favouriteGym: Gym;
  pendingRequests: any;
  matchCount: number;
};

export default function ProfilePage(props: Props) {
  const { user, users, favouriteGym, pendingRequests, matchCount } = props;

  const [isShredding, setIsShredding] = useState(false);
  const [isBulking, setIsBulking] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [potentialBuddies, setPotentialBuddies] = useState(
    users.filter((buddy: User) => buddy.id !== user.id),
  );
  console.log(matchCount);
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

  return (
    <div className="bg-white !p-8 rounded-lg shadow-xl h-170 w-full animate-fade-in-down">
      {/* Header: User Info */}
      <div className="flex justify-around items-center !mb-6">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-24 h-24 object-cover rounded-full border-4 border-blue-200 hover:border-blue-300 transition-all duration-300"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <p className="text-gray-600 mt-1">{user.age} years old</p>
        </div>
      </div>

      {/* Tabs: Contact Info / Settings / Preferences */}
      <div className="!mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`!py-2 !px-4 ${
              activeTab === 'contact'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Info
          </button>
          <button
            className={`!py-2 !px-4 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`!py-2 !px-4 ${
              activeTab === 'preferences'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          {/* Matches Button */}
          <Link href={{ pathname: `/profile/${user.username}/matches` }}>
            <button className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
              {matchCount} Matches
            </button>
          </Link>

          {/* Pending Requests Button */}
          <Link href={{ pathname: `/profile/${user.username}/requests` }}>
            <button className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mt-2">
              {pendingRequests?.length || 0} Pending Requests
            </button>
          </Link>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              <FaTwitter className="inline mr-1" /> Twitter
            </Link>
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              <FaFacebook className="inline mr-1" /> Facebook
            </Link>
            <Link href="" className="text-blue-500 hover:text-blue-600">
              <FaLinkedin className="inline mr-1" /> LinkedIn
            </Link>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Change Password Button */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Security
            </h3>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold !py-2 !px-4 rounded-lg transition duration-300">
              <IoMdSettings className="inline mr-2" />
              Edit data
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Notification Preferences
            </h3>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isShredding}
                onChange={() => setIsShredding(!isShredding)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Shredding</span>
            </label>
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                checked={isBulking}
                onChange={() => setIsBulking(!isBulking)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Bulking</span>
            </label>
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                checked={isExperienced}
                onChange={() => setIsExperienced(!isExperienced)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Experienced</span>
            </label>
          </div>
          {/* Potential Gym Buddies Section */}
          <div className="mt-8 text-center">
            <p className="text-lg font-medium">
              {potentialBuddies.length} Potential Gym Buddies
            </p>
            <Link
              href={{
                pathname: `/profile/${user.username}/potential-buddies`,
              }}
            >
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold !py-2 !px-4 rounded-lg transition duration-300">
                Let's Go!
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
