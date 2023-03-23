export async function up(sql) {
  await sql`
  CREATE TABLE gyms (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  gym_name VARCHAR(25) NOT NULL UNIQUE,
  gym_address VARCHAR(80) NOT NULL,
  gym_postal_code VARCHAR(4) NOT NULL,
  gym_link VARCHAR(250) NOT NULL
)
`;
}

export async function down(sql) {
  await sql`
  DROP TABLE gyms
`;
}
