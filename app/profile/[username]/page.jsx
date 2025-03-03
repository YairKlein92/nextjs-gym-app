// import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { getFavouriteGymByUserId } from '../../../database/gyms';
import {
  getAnsweredMatchRequestById,
  getUnAnsweredMatchRequestById,
} from '../../../database/matches';
// import { Component } from 'react';
import { getUserByUsername, getUsers } from '../../../database/users';
import ProfilePage from './ProfilePage';

// type Props = { params: { username: string } };

export default async function Profile({ params }) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }
  const favouriteGym = await getFavouriteGymByUserId(user.id);
  const users = await getUsers();
  const matchObject = await getAnsweredMatchRequestById(user.id);
  const matchArray = [matchObject]; // Now `matchArray` is an array with the object inside.

  console.log('matchArray', matchArray);
  const matchCount = matchArray.length;

  const pendingRequests = await getUnAnsweredMatchRequestById(user.id);
  // const matches = await;

  return (
    <ProfilePage
      user={user}
      users={users}
      favouriteGym={favouriteGym} // only line with TS error
      pendingRequests={pendingRequests}
      matchCount={matchCount}
    />
  );
}
