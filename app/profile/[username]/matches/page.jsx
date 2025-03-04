import { notFound } from 'next/navigation';
import { getPositivelyAnsweredMatchRequestById } from '../../../../database/matches';
import { getUserByUsername } from '../../../../database/users';
import MatchesPage from './MatchesPage';

export default async function Matches({ params }) {
  if (!params || !params.username) {
    return notFound();
  }

  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return notFound();
  }

  const matchesFromJointTable = await getPositivelyAnsweredMatchRequestById(
    user.id,
  );
  console.log('matchesFromJointTable', matchesFromJointTable);

  return (
    <MatchesPage user={user} matchesFromJointTable={matchesFromJointTable} />
  );
}
