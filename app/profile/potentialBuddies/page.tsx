import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
// import { Component } from 'react';
import {
  getUserBySessionToken,
  getUserByUsername,
  getUsers,
} from '../../../database/users';
import styles from '../page.module.scss';

type Props = { params: { username: string } };
export default async function UserProfile({ params }: Props) {
  // const user = await getUserByUsername(params.username);
  const user = getUserBySessionToken('sessionToken');
  console.log('on potentialBuddies page', user);
  const users = await getUsers();

  // if (!user) {
  //   notFound();
  // }

  return (
    <>
      Hello
      {users.map((buddy) => {
        return (
          <div key={`user-${buddy.id}`}>
            {buddy.username}
            {buddy.age}
            {buddy.isBulking ? 'Bulking' : null}
            {buddy.isShredding ? 'Cutting' : null}
            <Link href={`/profile/${buddy.username}`}>Profile</Link>
          </div>
        );
      })}
    </>
  );
}
