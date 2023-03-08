const usersFavouriteGyms = [{ id: 1, user_id: 1, gym_id: 1 }];

export async function up(sql) {
  await sql`
    INSERT INTO favourite_gyms ${sql(usersFavouriteGyms, 'user_id', 'gym_id')}
  `;
}
export async function down(sql) {
  for (const userFavouriteGyms of usersFavouriteGyms) {
    await sql`
      DELETE FROM
        favourite_gyms
      WHERE
        id = ${userFavouriteGyms.id}
    `;
  }
}
