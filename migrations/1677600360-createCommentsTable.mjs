export async function up(sql) {
  await sql`
    CREATE TABLE comments (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id integer NOT NULL REFERENCES users(id),
      comment varchar(500) NOT NULL,
      is_visible BOOLEAN NOT NULL
      -- , timestamp timestamp NOT NULL DEFAULT NOW()

    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE comments
  `;
}
