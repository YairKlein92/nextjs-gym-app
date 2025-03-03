import { notFound } from 'next/navigation';
import {
  addMatch,
  getBlockedUsersById,
  getSentOrReceivedRequestsFromDatabase,
} from '../../../../database/matches';
import { getUserByUsername, getUsers } from '../../../../database/users';
import PotentialBuddyProfile from './PotentialBuddies';

// type Props = { params: { username: string } };
export default async function PotentialBuddyPage({ params }) {
  const user = await getUserByUsername(params.username);

  const users = await getUsers();
  const blockedUsers = (await getBlockedUsersById(user.id)) || [];
  if (!user) {
    notFound();
  }
  console.log('blocked users', blockedUsers);

  const listOfUsersWithoutMe = users.filter((buddy) => buddy.id !== user.id);

  const mySentOrReceivedRequests = await getSentOrReceivedRequestsFromDatabase(
    user.id,
  );
  console.log('mySentOrReceivedRequests ->', mySentOrReceivedRequests); // Debug line

  // BUG - mySentOrReceivedRequests is undefined
  const filteredUsers = listOfUsersWithoutMe.filter(
    (user) =>
      !Array.isArray(mySentOrReceivedRequests) ||
      !mySentOrReceivedRequests.some((match) =>
        [match.userPendingId, match.userRequestingId].includes(user.id),
      ),
  );

  const filteredUsersWithoutBlockedUsers = filteredUsers.filter((theUser) => {
    return (
      !Array.isArray(blockedUsers) ||
      !blockedUsers.some((blockedUser) => blockedUser.id === theUser.id)
    );
  });
  console.log(
    'filteredUsersWithoutBlockedUsers',
    filteredUsersWithoutBlockedUsers,
  );
  // }
  const button = ({ label, user1_id, user2_id }) => {
    // : React.FC<ButtonProps>
    async function handleButtonClick() {
      const result = await addMatch(user1_id, user2_id, true, false, false);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    }

    return <button onClick={handleButtonClick}>{label}</button>;
  };

  return (
    <PotentialBuddyProfile
      user={user}
      listOfUsersWithoutMe={filteredUsersWithoutBlockedUsers}
      blockedUsers={blockedUsers}
    />
  );
}
