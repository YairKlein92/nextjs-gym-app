import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
// import styles from '../page.module.scss';
// import { Component } from 'react';
import { getUserByUsername, getUsers, User } from '../../../../database/users';
import styles from './page.module.scss';

// import { useParams } from 'react-router-dom';
// const param = useParams();
// console.log('params', params);

type Props = { params: { username: string } };
export default async function PotentialBuddyProfile({ params }: Props) {
  const user = await getUserByUsername(params.username);
  console.log('user on PotentialBuddyPage', user.username);

  const users = await getUsers();

  if (!user) {
    notFound();
  }
  const listOfUsersWithoutMe = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        {listOfUsersWithoutMe.map((buddy) => {
          return (
            <div key={`user-${buddy.id}`} className={styles.searchDiv}>
              <div className={styles.infoDiv}>
                <div>{buddy.username}</div>
                <div>{buddy.age}</div>
                <div>
                  {buddy.isBulking ? 'Bulking' : null}
                  {buddy.isShredding ? 'Cutting' : null}
                </div>
                <Link href={`/profile/${buddy.username}`}>Profile</Link>
              </div>
              <div className={styles.pictureDiv}>.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
