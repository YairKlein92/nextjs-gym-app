import pg from 'pg';

const client = new pg.Client({
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
  await client.connect();

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
    await client.end();
  }
}
