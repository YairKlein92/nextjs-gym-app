export async function up(sql) {
  await sql`
  CREATE TABLE users (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(25) NOT NULL UNIQUE,
password_hash VARCHAR(80) NOT NULL,
mail VARCHAR(50) NOT NULL,
age INTEGER NOT NULL,
mobile VARCHAR(50) NOT NULL,
favourite_gym VARCHAR(50),
is_shredding BOOLEAN NOT NULL,
is_bulking BOOLEAN NOT NULL,
is_experienced BOOLEAN NOT NULL
)
`;
}

export async function down(sql) {
  await sql`
  DROP TABLE users
`;
}
