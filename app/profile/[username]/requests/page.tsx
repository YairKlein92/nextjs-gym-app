import { getMatchRequestById } from '../../../../database/matches';
import { getUserById, getUserByUsername } from '../../../../database/users';
import PendingRequests from './PendingRequests';

export default async function PendingRequestsPage({ params }: any) {
  const username = params.username;
  const user = await getUserByUsername(username);
  if (!user) {
    console.error('No user');
  }
  const requests = await getMatchRequestById(user.id);
  console.log('request array', requests);
  return <PendingRequests requests={requests} user={user} />;
}
