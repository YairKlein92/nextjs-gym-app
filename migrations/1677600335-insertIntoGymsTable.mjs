const gyms = [
  {
    id: 1,
    gym_name: 'FitInn Johnstrasse',
    gym_address: 'Wien, Johnstrasse 65',
    gym_postal_code: '1150',
    gym_link:
      'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.1991027,16.3182192,16.44z/data=!4m6!3m5!1s0x476d07ff755fa507:0x56fef64ca1043d38!8m2!3d48.1986918!4d16.3187026!16s%2Fg%2F1tkd_rzc',
  },
  {
    id: 2,
    gym_name: 'FitInn Stadion Center',
    gym_address: 'Wien, Olympiaplatz 2',
    gym_postal_code: '1020',
    gym_link:
      'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2093744,16.4215496,17z/data=!3m2!4b1!5s0x476d073a7629fdb3:0xcd3dc8ea8b96810!4m6!3m5!1s0x476d073a62dde93b:0x81d9f2bb22688055!8m2!3d48.2093744!4d16.4237383!16s%2Fg%2F1hbpwqd1p',
  },
  {
    id: 3,
    gym_name: 'FitInn K1 Kagraner Platz',
    gym_address: 'Wien, Kagraner Platz 1-4',
    gym_postal_code: '1220',
    gym_link:
      'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2500319,16.4420084,17z/data=!3m1!4b1!4m6!3m5!1s0x476d06bac6def1f7:0xcf3a72aa8fd4c241!8m2!3d48.2500319!4d16.4441971!16s%2Fg%2F1hc7kr8rr',
  },
  {
    id: 4,
    gym_name: 'FitInn Schwedenplatz',
    gym_address: 'Laurenzerberg 2',
    gym_postal_code: '1010',
    gym_link:
      'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2110469,16.3763071,17z/data=!3m1!4b1!4m6!3m5!1s0x476d07b8a52d475b:0x8f1804165fe5dbfd!8m2!3d48.2110469!4d16.3784958!16s%2Fg%2F11rr91n1v8',
  },
  {
    id: 5,
    gym_name: 'FitInn Rathausplatz',
    gym_address: 'Wien, Rathausplatz 2',
    gym_postal_code: '1010',
    gym_link:
      'https://www.google.at/maps/place/FITINN+Fitnessstudio/@48.2118159,16.3581766,17z/data=!3m1!4b1!4m6!3m5!1s0x476d0795fa349837:0xb57c57f9f370723e!8m2!3d48.2118159!4d16.3581766!16s%2Fg%2F11g68__b4w',
  },
];

export async function up(sql) {
  await sql`
  INSERT INTO gyms ${sql(
    gyms,
    'gym_name',
    'gym_address',
    'gym_postal_code',
    'gym_link',
  )}
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
