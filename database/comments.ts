import { Pool } from 'pg';

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
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO comments (user_id, match_id, comment) VALUES ($1, $2, $3)',
      [user_id, match_id, comment],
    );
    return { success: true, message: 'Comment added successfully' };
  } catch (err) {
    console.error('Error adding comment', err);
    return { success: false, message: 'Error adding comment' };
  } finally {
    client.release();
  }
}
