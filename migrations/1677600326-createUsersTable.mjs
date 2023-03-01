export async function up(sql) {
  await sql`
  CREATE TABLE users (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(50) NOT NULL,
password VARCHAR(255) NOT NULL,
mail VARCHAR(50) NOT NULL,
age INTEGER NOT NULL,
mobile VARCHAR(50) NOT NULL,
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
