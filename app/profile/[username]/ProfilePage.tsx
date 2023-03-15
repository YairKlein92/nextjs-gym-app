'use client';
// import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User } from '../../../database/users';
import styles from './page.module.scss';

export default function ProfilePage(props: User) {
  const user = props.user;
  console.log('clientside user: ', user);
  const users = props.users;
  console.log('clientside users: ', users);
  if (!user) {
    notFound();
  }
  const favouriteGym = props.favouriteGym;
  const potentialBuddie: User = users[1];
  const listOfUsersWithoutMe: User[] = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerDiv}>My potential buddy is...</div>
        <div className={styles.filterDiv}>
          <ul>
            <li>
              {' '}
              Somebody who is {user.isShredding ? 'shredding' : 'bulking'}
            </li>
            <li> With {user.isExperienced ? 'experience' : 'no experience'}</li>
          </ul>

          <div className={styles.gymFilterDiv}>
            <div className={styles.line}>{favouriteGym.gymName}</div>
            <div className={styles.line}>{favouriteGym.gymAddress}</div>
          </div>
        </div>
        <div className={styles.potentialDiv}>
          <div>{listOfUsersWithoutMe.length} potencial gym buddies</div>
          <Link href={`/profile/${user.username}/potential-buddies`}>
            <img src="/check-out.png" alt="Check potential matches" />
          </Link>
        </div>
        <div className={styles.potentialDiv}>
          <div>Best match for you:</div>
          <Link className={styles.linkAccept} href="/">
            {' '}
            Yes!
          </Link>
        </div>
        <div className={styles.potentialBuddyDiv}>
          <div className={styles.descriptionDiv}>
            <div className={styles.buddyName}>{potentialBuddie.username}</div>
            {potentialBuddie.age} years old
            <div>{potentialBuddie.isBulking ? 'Bulking' : null}</div>
            <div>{potentialBuddie.isShredding ? 'Cutting' : null}</div>
            <div>
              {potentialBuddie.isExperienced ? 'Experienced' : null}
              <div>{users[1].mail}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
