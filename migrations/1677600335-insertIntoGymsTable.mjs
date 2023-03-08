const gyms = [
  {
    id: 1,
    gym_name: 'FitInn Johnstrasse',
    gym_address: 'Wien, Johnstrasse 65',
    gym_postal_code: '1150',
  },
  {
    id: 2,
    gym_name: 'FitInn Stadion Center',
    gym_address: 'Wien, Olympiaplatz 2',
    gym_postal_code: '1020',
  },
  {
    id: 3,
    gym_name: 'FitInn K1 Kagraner Platz',
    gym_address: 'Wien, Kagraner Platz 1-4',
    gym_postal_code: '1220',
  },
  {
    id: 4,
    gym_name: 'FitInn Schwedenplatz',
    gym_address: 'Laurenzerberg 2',
    gym_postal_code: '1010',
  },
  {
    id: 5,
    gym_name: 'FitInn Rathausplatz',
    gym_address: 'Wien, Rathausplatz 2',
    gym_postal_code: '1010',
  },
];

export async function up(sql) {
  await sql`
  INSERT INTO gyms ${sql(gyms, 'gym_name', 'gym_address', 'gym_postal_code')}
  `;
}
export async function down(sql) {
  for (const gym of gyms) {
    await sql`
  DELETE FROM
    gyms
  WHERE
    id = ${gym.id}
  `;
  }
}
