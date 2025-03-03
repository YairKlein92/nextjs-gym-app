import { getUnAnsweredMatchRequestById } from '../../../../database/matches';
import { getUserByUsername } from '../../../../database/users';
import PendingRequests from './PendingRequests';

export default async function PendingRequestsPage({ params }: any) {
  const username = params.username;
  console.log('params', params);
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  const requests = await getUnAnsweredMatchRequestById(user.id);
  return <PendingRequests requests={requests} user={user} />;
}
