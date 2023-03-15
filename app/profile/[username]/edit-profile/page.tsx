import { getFavouriteGymsByUserId } from '../../../../database/gyms';
import { getGyms, getUserByUsername } from '../../../../database/users';
import EditProfile from './EditProfile';

export type FavouriteGym = {
  id: number;
  gymName: string;
  gymAddress: string;
  gymPostalCode: string;
};
export type UserWithoutPassword = Omit<User, 'password'>;

export default async function EditPage({ params }: Props) {
  const gyms = await getGyms();

  const user = await getUserByUsername(params.username);
  console.log('user on EditPage ->', user);
  const favouriteGym: FavouriteGym = await getFavouriteGymsByUserId(user.id);

  return <EditProfile user={user} gyms={gyms} favouriteGym={favouriteGym} />;
}
