'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Users } from '../../../../database/users';
import styles from './page.module.css';

export type Props = {
  user: User;
  matchesFromJointTable: Users | undefined;
};

export default function MatchesPage(props: Props) {
  // Ensure matches is an array
  const matches = Array.isArray(props.matchesFromJointTable)
    ? props.matchesFromJointTable
    : [props.matchesFromJointTable];
  console.log('Matches:', matches);
  const user = props.user;
  const router = useRouter();

  const denyButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    const response = await fetch(
      `/api/matches/user/${user.id}/actions/delete`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequestingId: requestingUserId,
          userPendingId: user.id,
          isRequested: false,
          isAccepted: false,
          isBlocked: false,
        }),
      },
    );

    if (response.ok) {
      console.log('Request denied');
    } else {
      console.error('Failed to deny request');
    }
    router.refresh();
  };

  const blockButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    const response = await fetch(`/api/matches/user/${user.id}/actions/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userRequestingId: requestingUserId,
        userPendingId: user.id,
        isRequested: false,
        isAccepted: false,
        isBlocked: true,
      }),
    });

    if (response.ok) {
      console.log('Request blocked');
    } else {
      console.error('Failed to block request');
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.titleDiv}>Your matches</div>
        {matches.length > 0 ? (
          matches.map((match) => {
            // Ensure that match is a valid object
            if (!match) {
              return null; // Skip rendering if match is undefined
            }

            return (
              <div key={`user-${match.id}`} className={styles.matchMainDiv}>
                <div className={styles.descriptionDiv}>
                  <div className={styles.username}>
                    {match.username} ({match.age})
                  </div>
                  <div>Mail: {match.mail}</div>
                  <div>Phone: {match.mobile}</div>
                  <div>
                    <Link
                      target="_blank"
                      rel="noopener"
                      href={{
                        pathname:
                          'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2093744,16.4215496,17z/data=!3m2!4b1!5s0x476d073a7629fdb3:0xcd3dc8ea8b96810!4m6!3m5!1s0x476d073a62dde93b:0x81d9f2bb22688055!8m2!3d48.2093744!4d16.4237383!16s%2Fg%2F1hbpwqd1p',
                      }}
                    >
                      FitInn Stadion
                    </Link>
                  </div>
                  <button
                    className={styles.buttonDelete}
                    onClick={(event) => denyButtonHandler(event, match.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.buttonDelete}
                    onClick={(event) => blockButtonHandler(event, match.id)}
                  >
                    Block
                  </button>
                  <Link
                    href={{
                      pathname: `/profile/${user.username}/matches/comments?username=${match.username}`,
                    }}
                  >
                    <span className={styles.button}>Comment</span>
                  </Link>
                </div>
                <div>
                  <img
                    src={match.profilePicture}
                    className={styles.profilePic}
                    alt=""
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noMatches}>
            You don't have any matches yet.
          </div>
        )}
      </div>
    </div>
  );
}
