// import React from 'react';
// import { addMatch } from '../../../../database/matches';

// type ButtonProps = {
//   label: string;
//   user1_id: number;
//   user2_id: number;
// };

// const Button: React.FC<ButtonProps> = ({ label, user1_id, user2_id }) => {
//   async function handleButtonClick() {
//     const result = await addMatch(user1_id, user2_id, false);
//     if (result.success) {
//       console.log(result.message);
//     } else {
//       console.error(result.message);
//     }
//   }

//   return <button onClick={handleButtonClick}>{label}</button>;
// };

// export default Button;
