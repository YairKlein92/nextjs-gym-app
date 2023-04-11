const matches = [
  {
    id: 1,
    user_requesting_id: 1,
    user_pending_id: 1,
    is_pending: false,
    is_accepted: true,
    is_blocked: false,
  },
];

export async function up(sql) {
  await sql`
    INSERT INTO matches ${sql(
      matches,
      'user_requesting_id',
      'user_pending_id',
      'is_pending',
      'is_accepted',
      'is_blocked',
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
