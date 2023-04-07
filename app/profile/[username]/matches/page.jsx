import { notFound } from 'next/navigation';
import { getPositivelyAnsweredMatchRequestById } from '../../../../database/matches';
import { getUserByUsername } from '../../../../database/users';
import MatchesPage from './MatchesPage';

// export type Params = { params: { username: string } };

export default async function Matches({ params }) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  const matchesFromJointTable = await getPositivelyAnsweredMatchRequestById(
    user.id,
  );
  return (
    <MatchesPage user={user} matchesFromJointTable={matchesFromJointTable} />
  );
}

// const pendingUserIds = matchesFromJointTable.map(
//   (match) => match.userPendingId,
// );

// const matches = await getUsersByIds(pendingUserIds);
