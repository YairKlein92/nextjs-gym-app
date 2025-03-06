'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Users } from '../../../../database/users';

export type Props = {
  user: User;
  matchesFromJointTable: Users | undefined;
};

export default function MatchesPage(props: Props) {
  const matches = Array.isArray(props.matchesFromJointTable)
    ? props.matchesFromJointTable
    : [props.matchesFromJointTable];
  const user = props.user;
  const router = useRouter();

  const deleteButtonHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    requestingUserId: number,
  ) => {
    event.preventDefault();
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
        userReceivingId: user.id,
        isPending: false,
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
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl p-8 flex flex-col rounded-lg shadow-xl space-y-8">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-3xl text-sky-400 font-bold">Your Matches</h2>
        </div>

        {matches.length > 0 ? (
          matches.map((match) => {
            if (!match) {
              return null;
            }

            return (
              <div
                key={`user-${match.id}`}
                className="flex flex-col md:flex-row items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex-1 md:flex md:items-center md:gap-4">
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-sky-400">
                      {match.username} ({match.age})
                    </div>
                    <div className="text-sm text-gray-400">
                      Mail: {match.mail}
                    </div>
                    <div className="text-sm text-gray-400">
                      Phone: {match.mobile}
                    </div>
                    <div className="mt-2 text-blue-400">
                      <Link
                        target="_blank"
                        rel="noopener"
                        href="https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2093744,16.4215496,17z/data=!3m2!4b1!5s0x476d073a7629fdb3:0xcd3dc8ea8b96810!4m6!3m5!1s0x476d073a62dde93b:0x81d9f2bb22688055!8m2!3d48.2093744!4d16.4237383!16s%2Fg%2F1hbpwqd1p"
                      >
                        FitInn Stadion
                      </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
                        onClick={(event) =>
                          deleteButtonHandler(event, match.id)
                        }
                      >
                        Delete
                      </button>
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none"
                        onClick={(event) => blockButtonHandler(event, match.id)}
                      >
                        Block
                      </button>
                      <Link href={`/profile/${user.username}/matches/comments`}>
                        <span className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
                          Comment
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <img
                    src={match.profilePicture}
                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                    alt={`${match.username}'s profile`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">
            You don't have any matches yet.
          </div>
        )}
      </div>
    </div>
  );
}
