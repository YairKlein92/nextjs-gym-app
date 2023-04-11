export async function up(sql) {
  await sql`
    CREATE TABLE favourite_gyms (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      gym_id integer NOT NULL REFERENCES gyms(id)
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE favourite_gyms
  `;
}
