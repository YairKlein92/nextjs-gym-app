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
  userPendingId: number;
  isRequested: boolean;
  isAccepted: boolean;
  isBlocked: boolean;
};

export default function PotentialBuddyProfile(props: Props) {
  const user = props.user;
  const listOfUsersWithoutMe: any = props.listOfUsersWithoutMe;
  const [matches, setMatches] = useState<number[]>([]);

  // Effect to load already matched users (this could be fetched from your backend if necessary)
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Fetching already matched users by userId
        const response = await fetch(`/api/matches?userId=${user.id}`);

        // Check if the response is okay
        if (!response.ok) {
          console.error('Failed to fetch matches:', response.statusText);
          return;
        }

        // Check if the content type is JSON
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const matchedUsers = await response.json();

          // Ensure the response is a valid array
          if (matchedUsers && Array.isArray(matchedUsers)) {
            setMatches(matchedUsers.map((match: Match) => match.userPendingId));
          } else {
            console.error('No valid match data returned');
          }
        } else {
          // If the response is not JSON, log it for debugging
          const responseText = await response.text();
          console.error('Response is not JSON:', responseText);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [user.id]);

  // Filter out users who are already matched or the logged-in user themselves
  const potentialBuddies = listOfUsersWithoutMe.filter((buddy: User) => {
    return (
      buddy.id !== user.id && // Exclude the logged-in user
      buddy.isBulking === user.isBulking &&
      buddy.isShredding === user.isShredding &&
      buddy.isExperienced === user.isExperienced &&
      !matches.includes(buddy.id) // Exclude already matched users
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
          isBlocked: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // After successful match creation, add this buddy to the matches state
      setMatches((prevMatches) => [...prevMatches, buddyId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.mainDiv}>
        <div className={styles.headerDiv}>Potential matches</div>
        {potentialBuddies.length > 0 ? (
          potentialBuddies.map((buddy: User) => {
            const matchDivId = `match-${buddy.id}`;
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
          })
        ) : (
          <div className={styles.noMatches}>No potential matches found</div>
        )}
      </div>
    </div>
  );
}
