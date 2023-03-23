const gymbuddies = [
  {
    username: 'Csaba Klein',
    password_hash:
      '$2y$10$YTnqxti.XLqNjOX4Dn15xOQxZXyk/oHY7KSMw0kh71sJZgSqf3Jty',
    mail: 'sympla@gmail.com',
    age: 30,
    mobile: '+436704005626',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: true,
    is_bulking: false,
    is_experienced: true,
    profile_picture: '',
  },
  {
    username: 'Arnie Schwarzenegger',
    password_hash: 'Arnie',
    mail: 'arnie@gmail.com',
    age: 65,
    mobile: '+36304833454',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: true,
    is_bulking: false,
    is_experienced: false,
    profile_picture: '',

  },
  {
    username: 'Markus Rühl',
    password_hash: 'Danvagyok',
    mail: 'markruhl@gmail.com',
    age: 50,
    mobile: '+36305546354',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: false,
    is_bulking: true,
    is_experienced: true,
    profile_picture: '',

  },
  {
    username: 'Denis Cyplenkov',
    password_hash: 'Danvagyok',
    mail: 'deniscyp@gmail.com',
    age: 45,
    mobile: '+4369904833454',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: false,
    is_bulking: true,
    is_experienced: false,
    profile_picture: '',

  },
  {
    username: 'Michaela Berenson',
    password_hash: 'Danvagyok',
    mail: 'michaela@gmail.com',
    age: 31,
    mobile: '+436604833454',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: true,
    is_bulking: false,
    is_experienced: false,
    profile_picture: '',

  },
  {
    username: 'Viktoria Kurz',
    password_hash: 'Danvagyok',
    mail: 'viki@gmail.com',
    age: 22,
    mobile: '+436704833465',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: false,
    is_bulking: true,
    is_experienced: false,
    profile_picture: '',

  },
];

export async function up(sql) {
  await sql`
  INSERT INTO users ${sql(
    gymbuddies,
    'username',
    'password_hash',
    'mail',
    'age',
    'mobile',
    'favourite_gym',
    'is_shredding',
    'is_bulking',
    'is_experienced',

  )}
  `;
}
