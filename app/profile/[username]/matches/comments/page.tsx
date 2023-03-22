import { getUserByUsername } from '../../../../../database/users';
import CommentsPage from './Comments';

export default async function Comments(props: any) {
  const matchUsername = props.searchParams.username;
  const match = await getUserByUsername(matchUsername);
  const user = await getUserByUsername(props.params.username);
  console.log('props', props.params.username);
  return <CommentsPage match={match} user={user} />;
}
