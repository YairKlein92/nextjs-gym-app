import { notFound } from 'next/navigation';
import { addMatch } from '../../../../database/matches';
import { getUserByUsername, getUsers, User } from '../../../../database/users';
import PotentialBuddyProfile from './PotentialBuddies';

type Props = { params: { username: string } };
export default async function PotentialBuddyPage({ params }: Props) {
  const user: any = await getUserByUsername(params.username);
  console.log('user on PotentialBuddyPage', user.username);

  const users: any = await getUsers();

  if (!user) {
    notFound();
  }
  const listOfUsersWithoutMe: any = users.filter(
    (buddy: User) => buddy.id !== user.id,
  );

  const Button: React.FC<ButtonProps> = ({ label, user1_id, user2_id }) => {
    async function handleButtonClick() {
      const result = await addMatch(user1_id, user2_id, false);
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
      listOfUsersWithoutMe={listOfUsersWithoutMe}
    />
  );
}
