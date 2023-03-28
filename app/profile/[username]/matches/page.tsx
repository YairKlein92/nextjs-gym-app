import { notFound } from 'next/navigation';
import { getPositivelyAnsweredMatchRequestById } from '../../../../database/matches';
import {
  getUserByUsername,
  getUsersByIds,
  User,
  Users,
} from '../../../../database/users';
import MatchesPage, { Props } from './MatchesPage';

export type Params = { params: { username: string } };

export default async function Matches({ params }: Params) {
  const user: Props = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  const matchesFromJointTable: Props =
    await getPositivelyAnsweredMatchRequestById(user.id);
  return (
    <MatchesPage user={user} matchesFromJointTable={matchesFromJointTable} />
  );
}

// const pendingUserIds = matchesFromJointTable.map(
//   (match) => match.userPendingId,
// );

// const matches = await getUsersByIds(pendingUserIds);
