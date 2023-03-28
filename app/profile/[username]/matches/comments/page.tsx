import { getUserCommentsByMatchId } from '../../../../../database/comments';
import { getUserByUsername, Props } from '../../../../../database/users';
import CommentsPage from './Comments';

export default async function Comments(props: Props) {
  const matchUsername = props.searchParams.username;
  const username = props.params.username;
  const match = await getUserByUsername(matchUsername);
  if (!match) {
    console.error('Match not found');
  }
  const user = await getUserByUsername(username);
  if (!user) {
    console.error('User not found');
  }
  const comments = await getUserCommentsByMatchId(user.id, match.id);
  return <CommentsPage match={match} user={user} comments={comments} />;
}
