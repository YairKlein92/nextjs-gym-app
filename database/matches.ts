import { cache } from 'react';
import { sql } from './connect';

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
};
export type Query = Array<Query>;
export type Blocked = Array<Blocked>;
type Matches = {
  userRequestingId: number;
  userPendingId: number;
};

export const addMatch = cache(
  async (
    user_requesting_id: number,
    user_pending_id: number,
    is_pending: boolean,
    is_accepted: boolean,
    is_blocked: boolean,
  ) => {
    const [result] = await sql<Matches[]>`
    INSERT INTO matches (user_requesting_id, user_pending_id, is_pending, is_accepted, is_blocked)
    VALUES (${user_requesting_id}, ${user_pending_id}, ${is_pending}, ${is_accepted}, ${is_blocked})
    RETURNING true AS success, 'Match added successfully' AS message;
  `;
    return result;
  },
);
export const getMatchesIdByLoggedInUserId = cache(async (userId: number) => {
  const matches = await sql<Matches[]>`
    SELECT m.id, m.user_requesting_id, m.user_pending_id
    FROM matches m
    WHERE m.user_requesting_id = ${userId};
  `;
  return matches;
});
// export const getMatchesIdByLoggedInUserId = cache(async (userId: number) => {
//   const [matches] = await sql<Matches[]>`
//     SELECT *
//     FROM matches
//     WHERE user_requesting_id = ${userId};
//   `;
//   return matches;
// });

// export const getSentOrReceivedRequestsFromDatabase = async (userId: number) => {
//   const [matches] = await sql<Matches[]>`
//     SELECT id, user_requesting_id, user_pending_id, is_pending, is_accepted
//     FROM matches
//     WHERE user_requesting_id = ${userId} OR user_pending_id = ${userId};
//   `;
//   return matches;
// };
export const getSentOrReceivedRequestsFromDatabase = cache(
  async (userId: number) => {
    const [matches] = await sql<Matches[]>`
    SELECT id, user_requesting_id, user_pending_id, is_pending, is_accepted
    FROM matches
    WHERE user_requesting_id = ${userId} OR user_pending_id = ${userId};
  `;
    console.log('matches:', matches);
    return matches;
  },
);

// export const getMatchRequestById = async (userId: number) => {
//   const pendingRequests = await sql`
//   SELECT
//       matches.id,
//       users.*
//     FROM
//       matches
//       JOIN users ON matches.user_requesting_id = users.id
//     WHERE
//       matches.user_pending_id = ${userId};
//   `;
//   return pendingRequests;
// };
export const getMatchRequestById = cache(async (userId: number) => {
  const [pendingRequests] = await sql<PendingRequests[]>`
  SELECT
      matches.id,
      users.*
    FROM
      matches
      JOIN users ON matches.user_requesting_id = users.id
    WHERE
      matches.user_pending_id = ${userId};
  `;
  return pendingRequests;
});
// export const getAnsweredMatchRequestById = async (userId: number) => {
//   const pendingRequests = await sql`
// SELECT
//   matches.id,
//   users.*
// FROM
//   matches
//   JOIN users ON (
//     (matches.user_requesting_id = users.id AND matches.user_pending_id != ${userId})
//     OR (matches.user_pending_id = users.id AND matches.user_requesting_id != ${userId})
//   )
// WHERE
//   (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
//   AND matches.is_requested = FALSE;
//     `;
//   return pendingRequests;
// };
export const getAnsweredMatchRequestById = cache(async (userId: number) => {
  const [pendingRequests] = await sql<PendingRequests[]>`
SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    (matches.user_requesting_id = users.id AND matches.user_pending_id != ${userId})
    OR (matches.user_pending_id = users.id AND matches.user_requesting_id != ${userId})
  )
WHERE
  (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_pending = FALSE;
    `;
  return pendingRequests;
});

// export const getPositivelyAnsweredMatchRequestById = async (userId: number) => {
//   const match = await sql`
// SELECT
//   matches.id,
//   users.*
// FROM
//   matches
//   JOIN users ON (
//     matches.user_requesting_id = users.id
//     OR matches.user_pending_id = users.id
//   )
// WHERE
//   (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
//   AND matches.is_requested = FALSE
//   AND matches.is_accepted = TRUE
//   AND users.id != ${userId};
//   `;
//   return match;
// };
export const getPositivelyAnsweredMatchRequestById = cache(
  async (userId: number) => {
    const [matches] = await sql<Matches[]>`
SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    matches.user_requesting_id = users.id
    OR matches.user_pending_id = users.id
  )
WHERE
  (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_pending = FALSE
  AND matches.is_accepted = TRUE
  AND users.id != ${userId};
  `;
    return matches;
  },
);
// export const getNegativelyAnsweredMatchRequestById = async (userId: number) => {
//   const match = await sql`
//   SELECT
//   matches.id,
//   users.*
// FROM
//   matches
//   JOIN users ON (
//     matches.user_requesting_id = users.id
//     OR matches.user_pending_id = users.id
//   )
// WHERE
//   (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
//   AND matches.is_requested = FALSE
//   AND matches.is_accepted = FALSE;
//   `;
//   return match;
// };

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
    OR matches.user_pending_id = users.id
  )
WHERE
  (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_pending = FALSE
  AND matches.is_accepted = FALSE;
  `;
    return matches;
  },
);

// export const getBlockedUsersById = async (userId: number) => {
//   const blocked = await sql`
//   SELECT
//   matches.id,
//   users.*
// FROM
//   matches
//   JOIN users ON (
//     matches.user_requesting_id = users.id
//     OR matches.user_pending_id = users.id
//   )
// WHERE
//   (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
//   AND matches.is_blocked = TRUE;

//   `;
//   return blocked;
// };

export const getBlockedUsersById = cache(async (userId: number) => {
  const [blocked] = await sql<Blocked[]>`
  SELECT
  matches.id,
  users.*
FROM
  matches
  JOIN users ON (
    matches.user_requesting_id = users.id
    OR matches.user_pending_id = users.id
  )
WHERE
  (matches.user_pending_id = ${userId} OR matches.user_requesting_id = ${userId})
  AND matches.is_blocked = TRUE;

  `;
  return blocked;
});

// export const getUnAnsweredMatchRequestById = async (userId: number) => {
//   const pendingRequests = await sql`
//   SELECT
//       matches.id,
//       users.*
//     FROM
//       matches
//       JOIN users ON matches.user_requesting_id = users.id
//     WHERE
//       matches.user_pending_id = ${userId} AND matches.is_requested = TRUE ;
//   `;
//   return pendingRequests;
// };
export const getUnAnsweredMatchRequestById = cache(async (userId: number) => {
  const [pendingRequests] = await sql<PendingRequests[]>`
  SELECT
      matches.id,
      users.*
    FROM
      matches
      JOIN users ON matches.user_requesting_id = users.id
    WHERE
      matches.user_pending_id = ${userId} AND matches.is_pending = TRUE ;
  `;
  return pendingRequests;
});

// export async function acceptMatchInDatabase(
//   userRequestingId: number,
//   userPendingingId: number,
// ) {
//   const query = await sql`
//     UPDATE matches
//     SET is_requested = FALSE, is_accepted = TRUE, is_blocked = FALSE
//     WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
//   `;
//   return query;
// }
export const acceptMatchInDatabase = cache(
  async (userRequestingId: number, userPendingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = TRUE, is_blocked = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingId}
  `;
    return query;
  },
);
// export async function denyMatchInDatabase(
//   userRequestingId: number,
//   userPendingingId: number,
// ) {
//   const query = await sql`
//     UPDATE matches
//     SET is_requested = FALSE, is_accepted = FALSE, is_blocked = FALSE
//     WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
//   `;
//   return query;
// }
export const denyMatchInDatabase = cache(
  async (userRequestingId: number, userPendingingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = FALSE, is_blocked = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
    return query;
  },
);

// export async function blockMatchInDatabase(
//   userRequestingId: number,
//   userPendingingId: number,
// ) {
//   const query = await sql`
//     UPDATE matches
//     SET is_requested = FALSE, is_accepted = FALSE, is_blocked = TRUE
//     WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
//   `;
//   return query;
// }

export const blockMatchInDatabase = cache(
  async (userRequestingId: number, userPendingingId: number) => {
    const [query] = await sql<Query[]>`
    UPDATE matches
    SET is_pending = FALSE, is_accepted = FALSE, is_blocked = TRUE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
    return query;
  },
);
