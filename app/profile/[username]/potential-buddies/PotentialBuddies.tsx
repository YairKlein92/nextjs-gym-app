'use client';

import React, { useState } from 'react';
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
  const user = props.user;
  const listOfUsersWithoutMe: any = props.listOfUsersWithoutMe;
  console.log(listOfUsersWithoutMe);
  const [matches, setMatches] = useState<number[]>([]);

  const potentialBuddies = listOfUsersWithoutMe.filter((buddy: User) => {
    return (
      buddy.isBulking === user.isBulking &&
      buddy.isShredding === user.isShredding &&
      buddy.isExperienced === user.isExperienced &&
      !matches.includes(buddy.id)
    );
  });

  const handleAddMatch = async (
    event: React.MouseEvent<HTMLButtonElement>,
    buddyId: number,
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
      // const data = await response.json();
      setMatches([...matches, buddyId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerDiv}>Potential matches</div>
        {potentialBuddies.map((buddy: User) => {
          const matchDivId = `match-${buddy.id}`;
          if (matches.includes(buddy.id)) {
            return null; // Skip rendering the match div
          }
          return (
            <div
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
                  className={styles.button}
                  onClick={(e) => handleAddMatch(e, buddy.id)}
                >
                  {' '}
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
          );
        })}
      </div>
    </div>
  );
}

// return (
//   <div
//     // ref={matchDivRef}
//     key={`user-${buddy.id}`}
//     className={styles.searchDiv}
//     id={`${buddy.id}`}
//   >
//     <div className={styles.infoDiv}>
//       <div>{buddy.username}</div>
//       <div>Age: {buddy.age}</div>
//       <div>
//         {buddy.isBulking ? 'Bulking' : null}
//         {buddy.isShredding ? 'Shredding' : null}
//       </div>
//       <div>{buddy.isExperienced ? 'Experienced' : null}</div>
//       <button
//         className={styles.button}
//         onClick={(e) => handleAddMatch(e, buddy.id, matchDivRef)}
//       >
//         {' '}
//         Add Match
//       </button>
//     </div>
//     <div className={styles.pictureDiv}>
//       <img
//         className={styles.picture}
//         src={buddy.profilePicture}
//         alt="User's profile"
//         width="120"
//         height="120"
//       />
//     </div>
//   </div>
// );
// })}
// </div>
// </div>
// );
// }
