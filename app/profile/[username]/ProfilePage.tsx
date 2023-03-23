'use client';
// import { cookies } from 'next/headers';
import Link from 'next/link';
import { Gym } from '../../../database/gyms';
import { User, Users } from '../../../database/users';
import styles from './page.module.scss';

export type Props = {
  user: User;
  users: Users;
  favouriteGym: Gym;
};
export default function ProfilePage(props: Props) {
  const user = props.user;
  const users = props.users;

  const favouriteGym = props.favouriteGym;
  const listOfUsersWithoutMe: User[] = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );
  const potentialBuddies = listOfUsersWithoutMe.filter((buddy: User) => {
    return (
      buddy.isBulking === user.isBulking &&
      buddy.isShredding === user.isShredding &&
      buddy.isExperienced === user.isExperienced
      // && !userMatches.some((match: Match) => match.userPendingId === buddy.id)
    );
  });
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
          <div>{potentialBuddies.length} potencial gym buddies</div>
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
            <div className={styles.buddyName}>{user.username}</div>
            {user.age} years old
            <div>{user.isBulking ? 'Bulking' : null}</div>
            <div>{user.isShredding ? 'Shredding' : null}</div>
            <div>
              {user.isExperienced ? 'Experienced' : null}
              <div>{user.mail}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
