// import Link from 'next/link';
// 'use client';
// import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { getFavouriteGymsByUserId } from '../../../database/gyms';
// import { Component } from 'react';
import { getUserByUsername, getUsers } from '../../../database/users';
import ProfilePage from './ProfilePage';

type Props = { params: { username: string } };

export default async function Profile({ params }: Props) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }
  console.log('userId on serverside page.tsx', user.id);

  const favouriteGym = await getFavouriteGymsByUserId(user.id);
  console.log('favouriteGym: ', favouriteGym);
  // console.log('favouriteGym: ', favouriteGym);
  const users = await getUsers();

  return <ProfilePage user={user} users={users} favouriteGym={favouriteGym} />;
}

// export default GoogleApiWrapper({
//   apiKey: 'apikey',
// })(MapContainer);

// class MapContainer extends Component {
//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         style={{ width: '15%', height: '30%' }}
//         zoom={14}
//         initialCenter={{ lat: 48.192956, lng: 16.315233 }}
//       />
//     );
//   }
// }
