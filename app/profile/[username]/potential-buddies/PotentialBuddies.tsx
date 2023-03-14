'use client';
// import '../../../globals.css';
import { filter } from '@chakra-ui/system';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';

async function addMatchButtonHandler(
  event: React.MouseEvent<HTMLButtonElement>,
  userId: number,
  buddyId: number,
  isAccepted: boolean,
) {
  event.preventDefault();

  await fetch('/api/matches', {
    method: 'POST',

    body: JSON.stringify({
      userRequestingId: userId,
      userPendingId: buddyId,
      isAccepted: isAccepted,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

type Props = { user: any; listOfUsersWithoutMe: any };

export default function PotentialBuddyProfile(props: Props) {
  const user = props.user;
  console.log('props.user -> user', user.username);
  const listOfUsersWithoutMe = props.listOfUsersWithoutMe;
  const potentialBuddies = listOfUsersWithoutMe.filter(
    (buddy: any) =>
      buddy.isBulking === user.isBulking &&
      buddy.isShredding === user.isShredding &&
      buddy.isExperienced === user.isExperienced,
  );
  if (!user) {
    notFound();
  }
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        {potentialBuddies.map((buddy: any) => {
          return (
            <div key={`user-${buddy.id}`} className={styles.searchDiv}>
              <div className={styles.infoDiv}>
                <div>{buddy.username}</div>
                <div>Age: {buddy.age}</div>
                <div>
                  {buddy.isBulking ? 'Bulking' : null}
                  {buddy.isShredding ? 'Cutting' : null}
                </div>
                <div>{buddy.isExperienced ? 'Experienced' : null}</div>
                <button
                  onClick={async (event) =>
                    await addMatchButtonHandler(event, user.id, buddy.id, true)
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
