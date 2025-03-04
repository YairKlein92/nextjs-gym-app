'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type MatchesProps = {
  matchArray: { id: string; username: string }[];
  pendingRequests: any; // Accepting it as is
  user: any;
};

export default function Matches({
  matchArray,
  pendingRequests,
  user,
}: MatchesProps) {
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  const [isPendingRequestVisible, setIsPendingRequestVisible] = useState(false);
  const router = useRouter();

  // Ensure pendingRequests is always an array
  const pendingRequestsArray = Array.isArray(pendingRequests)
    ? pendingRequests
    : [pendingRequests];

  // Handle accept button action
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
            userReceivingId: user.id,
            isPending: false,
            isAccepted: true,
            isDenied: false,
            isBlocked: false,
          }),
        },
      );
      if (response.ok) {
        console.log('Request accepted');
        router.refresh(); // Refresh to show updated state
      } else {
        console.error('Failed to accept request');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deny button action
  const denyButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/matches/user/${user.id}/actions/deny`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userRequestingId: requestingUserId,
            userReceivingId: user.id,
            isPending: false,
            isAccepted: false,
            isDenied: true,
            isBlocked: false,
          }),
        },
      );
      if (response.ok) {
        console.log('Request denied');
        router.refresh(); // Refresh to show updated state
      } else {
        console.error('Failed to deny request');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle block button action
  const blockButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/matches/user/${user.id}/actions/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userRequestingId: requestingUserId,
            userReceivingId: user.id,
            isPending: false,
            isAccepted: false,
            isDenied: true,
            isBlocked: false,
          }),
        },
      );
      if (response.ok) {
        console.log('Request blocked');
        router.refresh(); // Refresh to show updated state
      } else {
        console.error('Failed to block request');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle match visibility
  const showMatchesHandler = () => {
    setIsMatchVisible(!isMatchVisible);
  };

  // Toggle pending requests visibility
  const showPendingRequestsHandler = () => {
    setIsPendingRequestVisible(!isPendingRequestVisible);
  };
  console.log('matchArray for length', matchArray);
  return (
    <div className="space-y-4">
      {/* Matches Button */}
      <button
        onClick={showMatchesHandler}
        className="w-full py-2 bg-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-600 hover:text-gray-100"
      >
        {matchArray.length} Matches
      </button>

      {/* Conditional Rendering to Show Matches */}
      {isMatchVisible &&
        Array.isArray(matchArray) &&
        matchArray.map((request) => (
          <div key={`user-${request.id}`}>{request.username}</div>
        ))}

      {/* Pending Requests Button */}
      <button
        onClick={showPendingRequestsHandler}
        className="w-full py-2 bg-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-600 hover:text-gray-100 mt-2"
      >
        {pendingRequestsArray.length || 0} Pending Requests
      </button>

      {/* Conditional Rendering to Show Pending Requests */}
      {isPendingRequestVisible &&
        // Ensure pendingRequestsArray is always an array, and handle if it's empty or contains invalid items
        (Array.isArray(pendingRequestsArray) &&
        pendingRequestsArray.length > 0 &&
        pendingRequestsArray.every((request) => request != null) ? (
          pendingRequestsArray.map((request: any) => (
            <div key={`user-${request.id}`}>
              <div className="flex justify-between">
                <Link
                  href={{
                    pathname: `/profile/${user.username}/requests`,
                  }}
                >
                  {request.username}
                </Link>
                <div className="space-x-2">
                  {/* Accept Button */}
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded"
                    onClick={(event) => acceptButtonHandler(event, request.id)}
                  >
                    Yes
                  </button>
                  {/* Deny Button */}
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={(event) => denyButtonHandler(event, request.id)}
                  >
                    No
                  </button>
                  {/* Block Button */}
                  <button
                    className="bg-gray-500 text-white py-1 px-2 rounded"
                    onClick={(event) => blockButtonHandler(event, request.id)}
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No pending requests</div>
        ))}
      {/* Social Links */}
      <div className="flex space-x-4 mt-4">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Twitter
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Facebook
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          LinkedIn
        </Link>
      </div>
    </div>
  );
}
