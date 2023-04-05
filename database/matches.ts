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
  is_blocked: boolean,
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO matches (user_requesting_id, user_pending_id, is_requested, is_accepted, is_blocked) VALUES ($1, $2, $3, $4, $5)',
      [
        user_requesting_id,
        user_pending_id,
        is_requested,
        is_accepted,
        is_blocked,
      ],
    );
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
    SELECT m.id, m.user_requesting_id, m.user_pending_id,m.is_requested, m.is_accepted
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
export const getAnsweredMatchRequestById = async (userId: number) => {
  const pendingRequests = await sql`
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
  AND matches.is_requested = FALSE;
    `;
  return pendingRequests;
};
export const getPositivelyAnsweredMatchRequestById = async (userId: number) => {
  const match = await sql`
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
  AND matches.is_requested = FALSE
  AND matches.is_accepted = TRUE
  AND users.id != ${userId};
  `;
  return match;
};
export const getNegativelyAnsweredMatchRequestById = async (userId: number) => {
  const match = await sql`
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
  AND matches.is_requested = FALSE
  AND matches.is_accepted = FALSE;
  `;
  return match;
};
export const getBlockedUsersById = async (userId: number) => {
  const blocked = await sql`
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
};
export const getUnAnsweredMatchRequestById = async (userId: number) => {
  const pendingRequests = await sql`
  SELECT
      matches.id,
      users.*
    FROM
      matches
      JOIN users ON matches.user_requesting_id = users.id
    WHERE
      matches.user_pending_id = ${userId} AND matches.is_requested = TRUE ;
  `;
  return pendingRequests;
};
export async function acceptMatchInDatabase(
  userRequestingId: number,
  userPendingingId: number,
) {
  const query = await sql`
    UPDATE matches
    SET is_requested = FALSE, is_accepted = TRUE, is_blocked = FALSE
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
    SET is_requested = FALSE, is_accepted = FALSE, is_blocked = FALSE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
  return query;
}
export async function blockMatchInDatabase(
  userRequestingId: number,
  userPendingingId: number,
) {
  const query = await sql`
    UPDATE matches
    SET is_requested = FALSE, is_accepted = FALSE, is_blocked = TRUE
    WHERE user_requesting_id = ${userRequestingId} AND user_pending_id = ${userPendingingId}
  `;
  return query;
}
