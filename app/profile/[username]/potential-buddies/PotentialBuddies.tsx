'use client';

// // import '../../../globals.css';
import React, { useState } from 'react';
import { User } from '../../../../database/users';
import styles from './page.module.scss';

// async function addMatchButtonHandler(
//   event: any, // React.MouseEvent<HTMLButtonElement>
//   userId: number,
//   buddyId: number,
//   isAccepted: boolean,
// ) {
//   event.preventDefault();

//   await fetch('/api/matches', {
//     method: 'POST',

//     body: JSON.stringify({
//       userRequestingId: userId,
//       userPendingId: buddyId,
//       isAccepted: isAccepted,
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// type Props = { user: User; listOfUsersWithoutMe: User[] };

// export default function PotentialBuddyProfile(props: Props) {
//   const user = props.user;
//   console.log('props.user -> user', user.username);
//   const listOfUsersWithoutMe = props.listOfUsersWithoutMe;
//   const potentialBuddies = listOfUsersWithoutMe.filter(
//     (buddy: User) =>
//       buddy.isBulking === user.isBulking &&
//       buddy.isShredding === user.isShredding &&
//       buddy.isExperienced === user.isExperienced,
//   );

//   return (
//     <div className={styles.pageDiv}>
//       <div className={styles.mainDiv}>
//         {potentialBuddies.map((buddy: any) => {
//           return (
//             <div key={`user-${buddy.id}`} className={styles.searchDiv}>
//               <div className={styles.infoDiv}>
//                 <div>{buddy.username}</div>
//                 <div>Age: {buddy.age}</div>
//                 <div>
//                   {buddy.isBulking ? 'Bulking' : null}
//                   {buddy.isShredding ? 'Cutting' : null}
//                 </div>
//                 <div>{buddy.isExperienced ? 'Experienced' : null}</div>
//                 <button
//                   onClick={async (event) =>
//                     await addMatchButtonHandler(event, user.id, buddy.id, true)
//                   }
//                 >
//                   Add Match
//                 </button>
//               </div>
//               <div className={styles.pictureDiv}>.</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // code that works but not when refreshing the page

// async function addMatchButtonHandler(
//   event: React.MouseEvent<HTMLButtonElement>,
//   userId: number,
//   buddyId: number,
//   isAccepted: boolean,
//   matchDivId: string,
// ) {
//   event.preventDefault();

//   await fetch('/api/matches', {
//     method: 'POST',

//     body: JSON.stringify({
//       userRequestingId: userId,
//       userPendingId: buddyId,
//       isAccepted: isAccepted,
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       const matchDiv = document.getElementById(matchDivId);
//       if (matchDiv) {
//         matchDiv.remove();
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// type Props = { user: User; listOfUsersWithoutMe: User[] };

// export default function PotentialBuddyProfile(props: Props) {
//   const user = props.user;
//   console.log('props.user -> user', user.username);
//   const listOfUsersWithoutMe = props.listOfUsersWithoutMe;
//   const potentialBuddies = listOfUsersWithoutMe.filter(
//     (buddy: User) =>
//       buddy.isBulking === user.isBulking &&
//       buddy.isShredding === user.isShredding &&
//       buddy.isExperienced === user.isExperienced,
//   );

//   return (
//     <div className={styles.pageDiv}>
//       <div className={styles.mainDiv}>
//         {potentialBuddies.map((buddy: any) => {
//           const matchDivId = `match-${buddy.id}`;
//           return (
//             <div key={matchDivId} className={styles.searchDiv} id={matchDivId}>
//               <div className={styles.infoDiv}>
//                 <div>{buddy.username}</div>
//                 <div>Age: {buddy.age}</div>
//                 <div>
//                   {buddy.isBulking ? 'Bulking' : null}
//                   {buddy.isShredding ? 'Cutting' : null}
//                 </div>
//                 <div>{buddy.isExperienced ? 'Experienced' : null}</div>
//                 <button
//                   onClick={async (event) =>
//                     await addMatchButtonHandler(
//                       event,
//                       user.id,
//                       buddy.id,
//                       true,
//                       matchDivId,
//                     )
//                   }
//                 >
//                   Add Match
//                 </button>
//               </div>
//               <div className={styles.pictureDiv}>.</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // code that is supposed to work finally
type Props = { user: User; listOfUsersWithoutMe: User[] };
export type Match = {
  id: number;
  userRequestingId: number;
  userPendingId: number;
  isAccepted: boolean;
};
export default function PotentialBuddyProfile(props: Props) {
  const user = props.user;
  const listOfUsersWithoutMe = props.listOfUsersWithoutMe;
  // const [userMatches, setUserMatches] = useState<Match[]>([]);

  // useEffect(() => {
  //   async function getUserMatches() {
  //     try {
  //       const response = await fetch(`/api/matches/user/${user.id}`);
  //       const matches = await response.json();
  //       setUserMatches(matches);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getUserMatches();
  // }, [user.id]);

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
    matchDivId: string,
  ) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({
          userRequestingId: user.id,
          userPendingId: buddyId,
          isAccepted: true,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      const matchDiv = document.getElementById(matchDivId);
      if (matchDiv) {
        matchDiv.remove();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        {potentialBuddies.map((buddy: User) => {
          const matchDivId = `match-${buddy.id}`;
          return (
            <div
              key={`user-${user.id}`}
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
                  onClick={(event) =>
                    handleAddMatch(event, buddy.id, matchDivId)
                  }
                >
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
