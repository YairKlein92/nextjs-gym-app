import { getFavouriteGymsByUserId } from '../../../../database/gyms';
import { getGyms, getUserByUsername } from '../../../../database/users';
import EditProfile from './EditProfile';

export default async function EditPage({ params }: Props) {
  // const user = await getUserByUsername(params.username);
  // console.log('user: ', user);

  // const favouriteGym = getFavouriteGymsByUserId(user.id);
  // console.log('favouriteGym: ', user.id);
  // const users = await getUsers();
  const gyms = await getGyms();

  const user = await getUserByUsername(params.username);

  console.log('user on EditpPage.tsx', user);

  const favouriteGym = await getFavouriteGymsByUserId(user.id);
  console.log('favouriteGym: ', favouriteGym);
  // console.log('favouriteGym: ', favouriteGym);

  return <EditProfile user={user} gyms={gyms} favouriteGym={favouriteGym} />;
}
