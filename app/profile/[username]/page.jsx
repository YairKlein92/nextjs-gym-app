// import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { getFavouriteGymByUserId } from '../../../database/gyms';
import {
  getPositivelyAnsweredMatchRequestById,
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
  const matchObject = await getPositivelyAnsweredMatchRequestById(user.id);
  const matchArray = [matchObject];

  console.log('matchArray', matchArray);
  const matchCount = matchArray.length;

  const pendingRequests = await getUnAnsweredMatchRequestById(user.id);

  return (
    <ProfilePage
      user={user}
      users={users}
      favouriteGym={favouriteGym}
      pendingRequests={pendingRequests}
      matchCount={matchCount}
      matchArray={matchArray}
    />
  );
}
