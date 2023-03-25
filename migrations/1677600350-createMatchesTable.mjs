export async function up(sql) {
  await sql`
    CREATE TABLE matches (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_requesting_id integer REFERENCES users(id) ON DELETE CASCADE,
      user_pending_id integer REFERENCES users(id),
      is_accepted BOOLEAN NOT NULL DEFAULT false
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE matches
  `;
}
