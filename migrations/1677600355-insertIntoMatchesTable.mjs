const matches = [
  {
    id: 1,
    user_requesting_id: 1,
    user_pending_id: 1,
    gym_id: 1,
    is_accepted: true,
  },
];

export async function up(sql) {
  await sql`
    INSERT INTO matches ${sql(
      matches,
      'user_requesting_id',
      'user_pending_id',
      'gym_id',
      'is_accepted',
    )}
  `;
}
export async function down(sql) {
  for (const match of matches) {
    await sql`
      DELETE FROM
        matches
      WHERE
        id = ${match.id}
    `;
  }
}
