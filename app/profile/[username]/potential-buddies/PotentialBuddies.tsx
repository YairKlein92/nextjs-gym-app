'use client';

import React, { useRef } from 'react';
import { User, Users } from '../../../../database/users';
import styles from './page.module.scss';

export type Props = { user: User; listOfUsersWithoutMe: User };
export type Match = {
  id: number;
  userRequestingId: number;
  userPendingId: number;
  isRequested: boolean;
  isAccepted: boolean;
};
export default function PotentialBuddyProfile(props: Props) {
  console.log('props hopefully with filtered array', props);
  const user = props.user;
  const listOfUsersWithoutMe: any = props.listOfUsersWithoutMe;
  console.log(
    'listOfUsersWithoutMe on PotentialBuddyProfile',
    listOfUsersWithoutMe,
  );

  const potentialBuddies = listOfUsersWithoutMe.filter((buddy: User) => {
    return (
      buddy.isBulking === user.isBulking &&
      buddy.isShredding === user.isShredding &&
      buddy.isExperienced === user.isExperienced
      // && !userMatches.some((match: Match) => match.userPendingId === buddy.id)
    );
  });

  const handleAddMatch = async (
    event: React.MouseEvent<HTMLButtonElement>,
    buddyId: number,
    matchDivRef: React.RefObject<HTMLDivElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({
          userRequestingId: user.id,
          userPendingId: buddyId,
          isRequested: true,
          isAccepted: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      if (matchDivRef.current) {
        matchDivRef.current.remove();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        {potentialBuddies.map((buddy: User) => {
          const matchDivRef = useRef<HTMLDivElement>(null);
          const matchDivId = `match-${buddy.id}`;
          return (
            <div
              ref={matchDivRef}
              key={`user-${buddy.id}`}
              className={styles.searchDiv}
              id={matchDivId}
            >
              <div className={styles.infoDiv}>
                <div>{buddy.username}</div>
                <div>Age: {buddy.age}</div>
                <div>
                  {buddy.isBulking ? 'Bulking' : null}
                  {buddy.isShredding ? 'Shredding' : null}
                </div>
                <div>{buddy.isExperienced ? 'Experienced' : null}</div>
                <button
                  onClick={(e) => handleAddMatch(e, buddy.id, matchDivRef)}
                >
                  {' '}
                  Add Match
                </button>
              </div>
              <div className={styles.pictureDiv}>.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
