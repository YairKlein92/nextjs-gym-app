'use client';
import { GoogleApiWrapper, Map } from 'google-maps-react';
import { notFound } from 'next/navigation';
import { Component } from 'react';
import { getUserByUsername } from '../../../database/users';

type Props = { params: { username: string } };
class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        style={{ width: '15%', height: '30%' }}
        zoom={14}
        initialCenter={{ lat: 48.192956, lng: 16.315233 }}
      />
    );
  }
}
// export default async function UserProfile({ params }: Props) {
//   const user = await getUserByUsername(params.username);

//   if (!user) {
//     notFound();
//   }

//   return (
//     <>
//       <h1>{user.username}</h1>
//       <p>id: {user.id}</p>

//     </>
//   );
// }
export default GoogleApiWrapper({
  apiKey: '',
})(MapContainer);
