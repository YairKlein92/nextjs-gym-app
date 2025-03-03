import { notFound } from 'next/navigation';
import { getPositivelyAnsweredMatchRequestById } from '../../../../database/matches';
import { getUserByUsername } from '../../../../database/users';
import MatchesPage from './MatchesPage';

export default async function Matches({
  params,
}: {
  params: { username: string };
}) {
  // Ensure that we wait for params to be available and valid
  const { username } = params;

  const user = await getUserByUsername(username);
  if (!user) {
    notFound(); // If user is not found, show a 404 page
  }

  const matchesFromJointTable = await getPositivelyAnsweredMatchRequestById(
    user.id,
  );
  console.log('matchesFromJointTable', matchesFromJointTable);

  return (
    <MatchesPage user={user} matchesFromJointTable={matchesFromJointTable} />
  );
}
