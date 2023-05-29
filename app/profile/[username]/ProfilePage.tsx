'use client';
// import { cookies } from 'next/headers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Gym } from '../../../database/gyms';
import { User, Users } from '../../../database/users';
import styles from './page.module.scss';

// import PotentialBuddyProfile from './potential-buddies/PotentialBuddies';

export type Props = {
  user: User;
  users: Users;
  favouriteGym: Gym;
  gymLink: string;
  pendingRequests: any;
  matchCount: number;
};
export default function ProfilePage(props: Props) {
  const user = props.user;
  const users = props.users;
  const pendingRequests = props.pendingRequests;
  const [isShredding, setIsShredding] = useState(false);
  const [isBulking, setIsBulking] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);

  const [potentialBuddies, setPotentialBuddies] = useState(
    users.filter((buddy: User) => buddy.id !== user.id),
  );
  const [click, setClick] = useState(false);
  const favouriteGym = props.favouriteGym;
  const listOfUsersWithoutMe: User[] = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );
  // pending requests function

  useEffect(() => {
    const filteredBuddies = listOfUsersWithoutMe.filter((buddy: User) => {
      switch (true) {
        case isShredding && !isBulking && !isExperienced:
          return buddy.isShredding;
        case !isShredding && isBulking && !isExperienced:
          return buddy.isBulking;
        case isShredding && isBulking && !isExperienced:
          return buddy.isShredding || buddy.isBulking;
        case !isShredding && !isBulking && isExperienced:
          return buddy.isExperienced;
        case !isShredding && isBulking && isExperienced:
          return buddy.isBulking && buddy.isExperienced;
        case isShredding && !isBulking && isExperienced:
          return buddy.isShredding && buddy.isExperienced;
        default:
          return false;
      }
    });
    setPotentialBuddies(filteredBuddies);
  }, [isBulking, isShredding, isExperienced]);
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerProfile}>
          {' '}
          <div className={styles.headerDiv}>
            Your profile
            <br />
            <span className={styles.username}>
              {user.username} ({user.age}y)
            </span>
          </div>{' '}
          <div>
            <img
              className={styles.profilePicture}
              src={user.profilePicture}
              alt="Your profile"
              height="100"
              width="100"
            />{' '}
          </div>
        </div>

        <div className={styles.potentialBuddyDiv}>
          <div className={styles.descriptionDiv}>
            <div className={styles.profileDiv}>
              {' '}
              <div>
                <a href={`/profile/${user.username}/matches`}>
                  <span className={styles.button}>
                    {props.matchCount} matches
                  </span>
                </a>
              </div>
              <Link href={{ pathname: `/profile/${user.username}/requests` }}>
                <span className={styles.button}>
                  <div>
                    {pendingRequests ? pendingRequests.length : '0'} pending
                    request(s)
                  </div>
                </span>
              </Link>
              <div>
                {' '}
                {/* <a target="_blank" rel="noreferrer" href={favouriteGym.gymLink}>
                  {favouriteGym.gymName}
                </a>{' '} */}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.filterDiv}>
          <div>Choose your preferences</div>

          <label
            htmlFor="bulking"
            className={`${styles.checkboxLabel} ${
              isBulking ? styles.checked : ''
            }`}
          >
            bulking
          </label>
          <input
            type="checkbox"
            id="bulking"
            className={styles.checkbox}
            onChange={() => {
              setIsBulking(!isBulking);
              setClick(!click);
            }}
          />

          <label
            htmlFor="shredding"
            className={`${styles.checkboxLabel} ${
              isShredding ? styles.checked : ''
            }`}
          >
            shredding
          </label>
          <input
            type="checkbox"
            id="shredding"
            className={styles.checkbox}
            onChange={() => {
              setIsShredding(!isShredding);
              setClick(!click);
            }}
          />
          <label
            htmlFor="experienced"
            className={`${styles.checkboxLabel} ${
              isExperienced ? styles.checked : ''
            }`}
          >
            experienced
          </label>
          <input
            type="checkbox"
            id="experienced"
            className={styles.checkbox}
            onChange={() => {
              setIsExperienced(!isExperienced);
              setClick(!click);
            }}
          />
        </div>
        <div className={styles.potentialDiv}>
          <div>{potentialBuddies.length} potencial gym buddies</div>
          <Link
            href={{ pathname: `/profile/${user.username}/potential-buddies` }}
          >
            <span>Let's Go!</span>
          </Link>
        </div>
        {/* <PotentialBuddyProfile potentialBuddies={potentialBuddies} /> */}
      </div>
    </div>
  );
}
