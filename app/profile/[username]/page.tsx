// import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { getFavouriteGymsByUserId, Gym } from '../../../database/gyms';
import { getMatchRequestById } from '../../../database/matches';
// import { Component } from 'react';
import { getUserByUsername, getUsers } from '../../../database/users';
import ProfilePage from './ProfilePage';

type Props = { params: { username: string } };

export default async function Profile({ params }: Props) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  const favouriteGym = await getFavouriteGymsByUserId(user.id);
  console.log('favouriteGym: ', favouriteGym);
  // console.log('favouriteGym: ', favouriteGym);
  const users = await getUsers();
  const pendingRequests = await getMatchRequestById(user.id);
  console.log(pendingRequests);

  return (
    <ProfilePage
      user={user}
      users={users}
      favouriteGym={favouriteGym}
      pendingRequests={pendingRequests}
    />
  );
}
