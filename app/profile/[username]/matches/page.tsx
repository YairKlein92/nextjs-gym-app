import { notFound } from 'next/navigation';
import { getMatchesIdByLoggedInUserId } from '../../../../database/matches';
import { getUserByUsername, getUsersByIds } from '../../../../database/users';
import MatchesPage from './MatchesPage';

export type Props = { params: { username: string } };
export default async function Matches(props: Props) {
  console.log(props.params.username);
  const user = await getUserByUsername(props.params.username);
  console.log('user on Matches page.tsx ->', user);
  if (!user) {
    notFound();
  }
  const matchesFromJointTable = await getMatchesIdByLoggedInUserId(user.id);
  const pendingUserIds = matchesFromJointTable.map(
    (match) => match.userPendingId,
  );

  console.log('pendingUserIds ->', pendingUserIds);
  const matches = await getUsersByIds(pendingUserIds);
  console.log('matches ->', matches);
  return <MatchesPage user={user} matches={matches} />;
}
