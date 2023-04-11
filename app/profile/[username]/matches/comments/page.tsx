import { getUserCommentsByMatchId } from '../../../../../database/comments';
import { getUserByUsername } from '../../../../../database/users';
import CommentsPage from './Comments';

export type Props = any;
export default async function Comments(props: Props) {
  const matchUsername = props.searchParams.username;
  const username = props.params.username;
  const match = await getUserByUsername(matchUsername);
  if (!match) {
    return null;
  }
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  const comments = await getUserCommentsByMatchId(user.id, match.id);

  // const visibleComments = comments.filter((comment) => {
  //   return comment.isVisible === true;
  // });
  return <CommentsPage match={match} user={user} comments={comments} />;
}
