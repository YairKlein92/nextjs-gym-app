export async function up(sql) {
  await sql`
    CREATE TABLE matches (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_requesting_id integer NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
      user_receiving_id integer NOT NULL REFERENCES users(id),
      is_pending BOOLEAN NOT NULL DEFAULT true, -- after denied or accepted, it would turn to false, thus the row still exists and the requester cannot send another request.
      is_accepted BOOLEAN NOT NULL DEFAULT false,
      is_denied BOOLEAN NOT NULL DEFAULT false,
      is_blocked BOOLEAN NOT NULL DEFAULT false
      )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE matches
  `;
}
