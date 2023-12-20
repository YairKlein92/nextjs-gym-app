const gymbuddies = [
  {
    username: 'CsabaJK',
    password_hash:
      '$2y$10$YTnqxti.XLqNjOX4Dn15xOQxZXyk/oHY7KSMw0kh71sJZgSqf3Jty',
    mail: 'sympla@gmail.com',
    age: 30,
    mobile: '+436704005626',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: true,
    is_bulking: false,
    is_experienced: true,
    profile_picture:
      'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1925&q=80',
  },
  {
    username: 'Arnie',
    password_hash: 'Arnie',
    mail: 'arnie@gmail.com',
    age: 42,
    mobile: '+36304833454',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: true,
    is_bulking: false,
    is_experienced: false,
    profile_picture:
      'https://plus.unsplash.com/premium_photo-1663036312913-620738b33f69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  },
  {
    username: 'ChristophTiger',
    password_hash: '',
    mail: 'chrisdt@gmail.com',
    age: 50,
    mobile: '+36305546354',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: false,
    is_bulking: true,
    is_experienced: true,
    profile_picture:
      'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1925&q=80',
  },
  {
    username: 'TRXGuy78',
    password_hash: 'Danvagyok',
    mail: 'deniscyp@gmail.com',
    age: 45,
    mobile: '+4369904833454',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: false,
    is_bulking: true,
    is_experienced: false,
    profile_picture:
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  },
  {
    username: 'Danvagyok',
    password_hash: 'Danvagyok',
    mail: 'michaela@gmail.com',
    age: 31,
    mobile: '+436604833454',
    favourite_gym: 'FitInn Kagraner Platz',
    is_shredding: true,
    is_bulking: false,
    is_experienced: false,
    profile_picture:
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=744&q=80',
  },
  {
    username: 'Viktoria',
    password_hash: 'Viktoria',
    mail: 'viki@gmail.com',
    age: 22,
    mobile: '+436704833465',
    favourite_gym: 'FitInn Johnstrasse',
    is_shredding: false,
    is_bulking: true,
    is_experienced: false,
    profile_picture:
      'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=468&q=80',
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
    'profile_picture',
  )}
  `;
}
