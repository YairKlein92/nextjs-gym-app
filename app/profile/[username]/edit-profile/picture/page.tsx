import { getUserByUsername } from '../../../../../database/users';
import ProfilePicture from './ProfilePicture';

type Props = {
  params: { username: string };
  searchParams: { username: string };
};
export default async function ProfilePicturePage(props: Props) {
  const username = props.params.username;

  const user = await getUserByUsername(username);

  return <ProfilePicture user={user} />;
}
