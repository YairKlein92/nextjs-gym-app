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
  console.log('props', props.params.username);
  const comments = await getUserCommentsByMatchId(user.id, match.id);
  console.log('comments', comments);
  return <CommentsPage match={match} user={user} comments={comments} />;
}
