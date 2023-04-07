import { getFavouriteGymsByUserId, getGyms } from '../../../../database/gyms';
import { getUserByUsername } from '../../../../database/users';
import EditProfile from './EditProfile';

// export type FavouriteGym = {
//   id: number;
//   gymName: string;
//   gymAddress: string;
//   gymPostalCode: string;
//   gymLink: string;
// };

export default async function EditPage({ params }) {
  const gyms = await getGyms();
  const user = await getUserByUsername(params.username);
  if (!user) {
    console.error('User not found');
  }
  const favouriteGym = await getFavouriteGymsByUserId(user.id);

  return <EditProfile user={user} gyms={gyms} favouriteGym={favouriteGym} />;
}
