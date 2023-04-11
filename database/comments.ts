import { Pool } from 'pg';
import { cache } from 'react';
import { sql } from './connect';

export type Comment = {
  id: number;
  userId: number;
  matchId: number;
  comment: string;
  isVisible: boolean;
};
const pool = new Pool({
  user: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
});
export async function addComment(
  user_id: number,
  match_id: number,
  comment: string,
  is_visible: boolean,
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO comments (user_id, match_id, comment, is_visible) VALUES ($1, $2, $3, $4)',
      [user_id, match_id, comment, is_visible],
    );
    console.log(result);
    return { success: true, message: 'Comment added successfully' };
  } catch (err) {
    console.error('Error adding comment', err);
    return { success: false, message: 'Error adding comment' };
  } finally {
    client.release();
  }
}

export async function removeComment(commentId: number, isVisible: boolean) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'UPDATE comments SET is_visible = $1 WHERE id = $2',
      [isVisible, commentId],
    );
    console.log(result);
    return { success: true, message: 'Comment removed successfully' };
  } catch (err) {
    console.error('Error removing comment', err);
    return { success: false, message: 'Error removing comment' };
  } finally {
    client.release();
  }
}
export const getUserCommentsByMatchId = cache(
  async (user_id: number, match_id: number) => {
    const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
      WHERE user_id = ${user_id} AND match_id = ${match_id}
    `;
    return comments;
  },
);
export const getUserCommentsByMatchIdAndVisibility = cache(
  async (user_id: number, match_id: number, is_visible: boolean) => {
    const [comments] = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
      WHERE user_id = ${user_id} AND match_id = ${match_id} AND is_visible = ${is_visible}
    `;
    return comments;
  },
);
