import { getFavouriteGymsByUserId } from '../../../../database/gyms';
import { getGyms, getUserByUsername } from '../../../../database/users';
import EditProfile from './EditProfile';

export default async function EditPage({ params }: Props) {
  // const favouriteGym = getFavouriteGymsByUserId(user.id);
  // console.log('favouriteGym: ', user.id);
  const gyms = await getGyms();

  const user = await getUserByUsername(params.username);

  const favouriteGym = await getFavouriteGymsByUserId(user.id);

  return <EditProfile user={user} gyms={gyms} favouriteGym={favouriteGym} />;
}
