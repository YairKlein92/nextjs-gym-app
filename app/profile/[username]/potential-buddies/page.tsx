// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { addMatch } from '../../../../database/matches';
// import styles from '../page.module.scss';
// import { Component } from 'react';
import { getUserByUsername, getUsers, User } from '../../../../database/users';
import Button from './Button';
import PotentialBuddyProfile from './PotentialBuddies';

// import { useParams } from 'react-router-dom';
// const param = useParams();
// console.log('params', params);

type Props = { params: { username: string } };
export default async function PotentialBuddyPage({ params }: Props) {
  const user: any = await getUserByUsername(params.username);
  console.log('user on PotentialBuddyPage', user.username);

  const users: any = await getUsers();

  if (!user) {
    notFound();
  }
  const listOfUsersWithoutMe: any = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  const Button: React.FC<ButtonProps> = ({ label, user1_id, user2_id }) => {
    async function handleButtonClick() {
      const result = await addMatch(user1_id, user2_id, false);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    }

    return <button onClick={handleButtonClick}>{label}</button>;
  };

  return (
    <>
      {/* <Button
        key={`user-${user.id}`}
        label="Add Buddy"
        user1_id={user.id}
        user2_id={user.id}
      /> */}
      <PotentialBuddyProfile
        user={user}
        listOfUsersWithoutMe={listOfUsersWithoutMe}
      />
    </>
  );
}
