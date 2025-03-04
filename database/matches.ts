import { cache } from 'react';
import { sql } from './connect';
import { Users } from './users';

export type PendingRequests = {
  id: number;
  passwordHash: string;
  mail: string;
  age: number;
  mobile: string;
  favourite_gym: string | null;
  isShredding: boolean;
  isBulking: boolean;
  isExperienced: boolean;
  profilePicture: string;
}[];
export type Query = Array<Query>;
export type Blocked = Array<Blocked>;
type Matches = {
  userRequestingId: number;
  userReceivingId: number;
};

export const addMatch = cache(
  async (
    user_requesting_id: number,
    user_receiving_id: number,
    is_pending: boolean,
    is_accepted: boolean,
    is_denied: boolean,
    is_blocked: boolean,
  ) => {
    const [result] = await sql<Matches[]>`
    INSERT INTO matches (user_requesting_id, user_receiving_id, is_pending, is_accepted, is_denied, is_blocked)
    VALUES (${user_requesting_id}, ${user_receiving_id}, ${is_pending},  ${is_accepted},${is_denied}, ${is_blocked})
    RETURNING true AS success, 'Match added successfully' AS message;
  `;
    return result;
  },
);
export const getMatchesIdByLoggedInUserId = cache(async (userId: number) => {
  const matches = await sql<Matches[]>`
    SELECT m.id, m.user_requesting_id, m.user_receiving_id
    FROM matches m
    WHERE m.user_requesting_id  = ${userId};
  `;
  return matches;
});

export const getSentOrReceivedRequestsFromDatabase = cache(
  async (userId: number) => {
    const matches = await sql<Matches[]>`
    SELECT id, user_requesting_id, user_receiving_id, is_pending, is_accepted
    FROM matches
    WHERE user_requesting_id = ${userId} OR user_receiving_id = ${userId};
  `;
    console.log('matches:', matches);
    return matches;
  },
);

export const getMatchRequestById = cache(async (userId: number) => {
  const [pendingRequests] = await sql<PendingRequests[]>`
  SELECT
      matches.id,
      users.*
    FROM
      matches
      JOIN users ON matches.user_requesting_id = users.id
    WHERE
      matches.user_receiving_id = ${userId};
  `;
  return pendingRequests;
});

export const getAnsweredMatchRequestById = cache(async (userId: number) => {
  const [pendingRequests] = await sql<PendingRequests[]>`
SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    (matches.user_requesting_id = users.id AND matches.user_receiving_id != ${userId})
    OR (matches.user_receiving_id = users.id AND matches.user_requesting_id != ${userId})
  )
WHERE
  (matches.user_receiving_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_pending = FALSE;
    `;
  return pendingRequests;
});

export const getPositivelyAnsweredMatchRequestById = cache(
  async (userId: number) => {
    try {
      const result = await sql<Users[]>`
        SELECT
          matches.id,
          users.*
        FROM
          matches
          JOIN users ON (
            matches.user_requesting_id = users.id
            OR matches.user_receiving_id = users.id
          )
        WHERE
          (matches.user_receiving_id = ${userId} OR matches.user_requesting_id = ${userId})
          AND matches.is_accepted = TRUE
          AND matches.is_blocked = FALSE
          AND users.id != ${userId};
      `;

      console.log('Matches fetched in the database file:', result);

      // If result is wrapped in an object, access the relevant array.
      const matches = result.rows || result; // Use result.rows if it's wrapped in 'rows'

      console.log('Matches:', matches);
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },
);

export const getNegativelyAnsweredMatchRequestById = cache(
  async (userId: number) => {
    const [matches] = await sql<Matches[]>`
  SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    matches.user_requesting_id = users.id
    OR matches.user_receiving_id = users.id
  )
WHERE
  (matches.user_receiving_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_pending = FALSE
  AND matches.is_accepted = FALSE;
  `;
    return matches;
  },
);

export const getBlockedUsersById = cache(async (userId: number) => {
  const [blocked] = await sql<Blocked[]>`
  SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    matches.user_requesting_id = users.id
    OR matches.user_receiving_id = users.id
  )
WHERE
  (matches.user_receiving_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_blocked = TRUE;

  `;
  return blocked;
});

export const getUnAnsweredMatchRequestById = cache(async (userId: number) => {
  const results = await sql<PendingRequests[]>`
  SELECT
      matches.id,
      users.*
    FROM
      matches
      JOIN users ON matches.user_requesting_id = users.id
    WHERE
      matches.user_receiving_id = ${userId} AND matches.is_pending = TRUE ;
  `;
  return results;
});

export const acceptMatchInDatabase = cache(
  async (userRequestingId: number, userReceivingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = TRUE, is_blocked = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_receiving_id = ${userReceivingId}
  `;
    return query;
  },
);

export const denyMatchInDatabase = cache(
  async (userRequestingId: number, userReceivingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = FALSE, is_blocked = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_receiving_id = ${userReceivingId}
  `;
    return query;
  },
);
export const deleteMatchInDatabase = cache(
  async (userRequestingId: number, userReceivingId: number) => {
    const query = await sql<Query[]>`
    DELETE FROM matches
    WHERE (user_requesting_id = ${userRequestingId} AND user_pending_id = ${userReceivingId})
    OR (user_requesting_id = ${userReceivingId} AND user_pending_id = ${userRequestingId});
  `;
    return query;
  },
);

export const blockMatchInDatabase = cache(
  async (userRequestingId: number, userPendingingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = FALSE, is_blocked = TRUE
    WHERE user_requesting_id = ${userRequestingId} AND user_receiving_id = ${userPendingingId}
  `;
    return query;
  },
);
