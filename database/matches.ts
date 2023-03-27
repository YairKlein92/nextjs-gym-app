import { Pool } from 'pg';
import { cache } from 'react';
import { sql } from './connect';

const pool = new Pool({
  user: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
});

export async function addMatch(
  user_requesting_id: number,
  user_pending_id: number,
  is_requested: boolean,
  is_accepted: boolean,
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO matches (user_requesting_id, user_pending_id, is_requested, is_accepted) VALUES ($1, $2, $3, $4)',
      [user_requesting_id, user_pending_id, is_requested, is_accepted],
    );
    console.log(result);
    return { success: true, message: 'Match added successfully' };
  } catch (err) {
    console.error('Error adding match', err);
    return { success: false, message: 'Error adding match' };
  } finally {
    client.release();
  }
}

export const getMatchesIdByLoggedInUserId = cache(async (userId: number) => {
  const matches = await sql`
    SELECT m.id, m.user_requesting_id, m.user_pending_id
    FROM matches m
    WHERE m.user_requesting_id = ${userId};
  `;
  return matches;
});

export const getUserMatchesFromDatabase = async (userId: number) => {
  const matches = await sql`
    SELECT m.id, m.user_requesting_id, m.user_pending_id, m.is_accepted
    FROM matches m
    WHERE m.user_requesting_id = ${userId} OR m.user_pending_id = ${userId};
  `;
  return matches;
};
export const getMatchRequestById = async (userId: number) => {
  const pendingRequests = await sql`
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
};

// export const getMatchRequestByIdforAcceptOrDeny = async (
//   userRequestingId: number,
//   userPendingId: number,
// ) => {
//   const pendingRequests = await sql`
//   SELECT
//       matches.id,
//     FROM
//       matches
//     WHERE
//       matches.user_requesting_id = ${userRequestingId} AND matches.user_pending_id = ${userPendingId}
//   `;
//   return pendingRequests;
// };

export async function acceptMatchInDatabase(
  userRequestingId: number,
  userPendingingId: number,
) {
  const query = await sql`
    UPDATE matches
    SET is_requested = FALSE, is_accepted = TRUE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
  return query;
}

export async function denyMatchInDatabase(
  userRequestingId: number,
  userPendingingId: number,
) {
  const query = await sql`
    UPDATE matches
    SET is_requested = FALSE, is_accepted = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
  return query;
}
