'use client';

import React, { useEffect, useState } from 'react';
import { User, Users } from '../../../../database/users';
import styles from './page.module.scss';

export type Props = {
  user: User;
  listOfUsersWithoutMe: Users;
};

export type Match = {
  id: number;
  userRequestingId: number;
  userReceivingId: number;
  isPending: boolean;
  isAccepted: boolean;
  isDenied: boolean;
  isBlocked: boolean;
};

export default function PotentialBuddyProfile(props: Props) {
  const user = props.user;
  const [potentialBuddies, setPotentialBuddies] = useState<User[]>(
    props.listOfUsersWithoutMe,
  );

  const handleAddMatch = async (
    event: React.MouseEvent<HTMLButtonElement>,
    buddyId: number,
  ) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequestingId: user.id,
          userReceivingId: buddyId,
          isPending: true,
          isAccepted: false,
          isDenied: false,
          isBlocked: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Remove the buddy from the list after successful match request
      setPotentialBuddies((prevBuddies) =>
        prevBuddies.filter((buddy) => buddy.id !== buddyId),
      );
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerDiv}>Potential matches</div>
        {potentialBuddies.length > 0 ? (
          potentialBuddies.map((buddy) => (
            <div key={`user-${buddy.id}`} className={styles.searchDiv}>
              <div className={styles.infoDiv}>
                <div>{buddy.username}</div>
                <div>Age: {buddy.age}</div>
                <div>
                  {buddy.isBulking ? 'Bulking' : null}
                  {buddy.isShredding ? 'Shredding' : null}
                </div>
                <div>{buddy.isExperienced ? 'Experienced' : null}</div>
                <button
                  className={styles.button}
                  onClick={(e) => handleAddMatch(e, buddy.id)}
                >
                  Add Match
                </button>
              </div>
              <div className={styles.pictureDiv}>
                <img
                  className={styles.picture}
                  src={buddy.profilePicture}
                  alt="User's profile"
                  width="120"
                  height="120"
                />
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noMatches}>No potential matches found</div>
        )}
      </div>
    </div>
  );
}
