'use client';

export default function PendingRequests(props: any) {
  const requests = props.requests;
  console.log(requests.id);
  const user = props.user;
  console.log('user.id', user.id);

  const acceptButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    console.log(event);

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
          }),
        },
      );
      console.log(response);
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
    console.log(event);
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
    <>
      {' '}
      <div>Your pending requests</div>
      {requests.map((req: any) => {
        return (
          <div key={`user-id-${req.id}`}>
            <div>name: {req.username}</div>
            <div>age: {req.age}</div>
            <div> mail: {req.mail} </div>
            <div>phone: {req.mobile}</div>
            <div>{req.isShredding}</div>
            <form method="post">
              <input type="hidden" name="matchId" />
              <button onClick={(event) => acceptButtonHandler(event, req.id)}>
                Accept
              </button>
            </form>
            <form method="post">
              <input type="hidden" name="matchId" />
              <button onClick={(event) => denyButtonHandler(event, req.id)}>
                Deny
              </button>
            </form>
          </div>
        );
      })}
    </>
  );
}
