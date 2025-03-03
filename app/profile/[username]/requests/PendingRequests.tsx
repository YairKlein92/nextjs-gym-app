'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function PendingRequests(props: any) {
  console.log('user in pending requests:', props.requests);

  let requests = [];
  if (props.requests && typeof props.requests === 'object') {
    // If it has only one request, wrap it in an array
    requests = [props.requests];
  } else if (Array.isArray(props.requests)) {
    // If it's already an array, keep it as is
    requests = props.requests;
  }
  console.log('Requests Data:', requests);

  const user = props.user;
  const router = useRouter();

  const acceptButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/matches/user/${user.id}/actions/accept`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userRequestingId: requestingUserId,
            userPendingId: user.id,
            isRequested: false,
            isAccepted: true,
            isBlocked: false,
          }),
        },
      );
      if (response.ok) {
        // The request was successful, update the UI
        console.log('Request accepted');
      } else {
        // Handle error
        console.error('Failed to accept request');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const denyButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    const response = await fetch(`/api/matches/user/${user.id}/actions/deny`, {
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
    });

    if (response.ok) {
      // The request was successful, update the UI
      console.log('Request denied');
    } else {
      // Handle error
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
      // The request was successful, update the UI
      console.log('Request denied');
    } else {
      // Handle error
      console.error('Failed to deny request');
    }
  };
  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.titleDiv}>Your pending requests</div>
        {requests.map((req: any) => {
          return (
            <div className={styles.requestDiv} key={`user-id-${req.id}`}>
              <div>
                {' '}
                <div>name: {req.username}</div>
                <div>age: {req.age}</div>
                <div> mail: {req.mail} </div>
                <div>phone: {req.mobile}</div>
                <div>{req.isShredding}</div>
                <div className={styles.buttonsDiv}>
                  <form method="post">
                    <input type="hidden" name="matchId" />
                    <button
                      className={styles.buttonAccept}
                      onClick={(event) => acceptButtonHandler(event, req.id)}
                    >
                      Accept
                    </button>
                  </form>{' '}
                  <form method="post">
                    <input type="hidden" name="matchId" />
                    <button
                      className={styles.buttonDeny}
                      onClick={(event) => denyButtonHandler(event, req.id)}
                    >
                      Deny
                    </button>
                  </form>
                </div>
                <form method="post">
                  <input type="hidden" name="matchId" />
                  <button
                    className={styles.buttonDeny}
                    onClick={(event) => blockButtonHandler(event, req.id)}
                  >
                    Block
                  </button>
                </form>
              </div>
              <div>
                <img
                  src={req.profilePicture}
                  className={styles.profilePic}
                  alt=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
