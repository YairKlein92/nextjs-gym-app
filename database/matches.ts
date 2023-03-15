import pg, { Pool } from 'pg';
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
  is_accepted: boolean,
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO matches (user_requesting_id, user_pending_id, is_accepted) VALUES ($1, $2, $3)',
      [user_requesting_id, user_pending_id, is_accepted],
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

// export const getMatches = cache(async (userId: number) => {});
