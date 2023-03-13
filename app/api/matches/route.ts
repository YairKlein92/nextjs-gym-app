// // import { NextApiRequest, NextApiResponse } from 'next';
// // {NextApiHandler}
// import pg from 'pg';

// // pool object for managing connection to the database
// const pool = new pg.Pool({
//   user: process.env.PGUSERNAME,
//   password: process.env.PGPASSWORD,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// //  function that listens for POST requests to the /api/match/matches endpoint.

// export default async function handler(req: any, res: any) {
//   if (req.method === 'POST') {
//     const { userRequestingId, userPendingId, isAccepted } = req.body;

//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');

//       const { rows: matches } = await client.query(
//         'INSERT INTO matches(user_requesting_id, user_pending_id, is_accepted) VALUES ($1, $2, $3) RETURNING *',
//         [userRequestingId, userPendingId, isAccepted],
//       );

//       await client.query('COMMIT');

//       res.status(200).json(matches);
//     } catch (e) {
//       await client.query('ROLLBACK');
//       res.status(500).json({ error: 'Database error occurred' });
//     } finally {
//       client.release();
//     }
//   } else {
//     res.status(404).json({ error: 'API route not found' });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addMatch } from '../../../database/matches';

const userSchma = z.object({
  userRequestingId: z.number(),
  userPendingId: z.number(),
  isAccepted: z.boolean(),
});

export type RegisterResponseBodyPost =
  | {
      errors: { message: string }[];
    }
  | {
      match: {
        userRequestingId: string;
        userPendingId: string;
        isAccepted: boolean;
      };
    };

export const POST = async (request: NextRequest) => {
  // Validating the data
  const body = await request.json();
  const result = userSchma.safeParse(body);
  if (!result.success) {
    // inside the if statement, result.error.issues there is more information about what is allowing you to create more specific error messages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // create the match
  const newMatch = await addMatch(
    result.data.userRequestingId,
    result.data.userPendingId,
    result.data.isAccepted,
  );
  console.log('new match:', newMatch);
  // return the new username
  return NextResponse.json({ match: { isAccepted: true } });
};
