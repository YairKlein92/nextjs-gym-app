import { NextResponse } from 'next/server';
import { getSentOrReceivedRequestsFromDatabase } from '../../../../../database/matches';

export const GET = async (request: any) => {
  // get the user id from the request
  const userId = request.query.userId as string;
  try {
    // get the user's matches
    const matches = await getSentOrReceivedRequestsFromDatabase(
      parseInt(userId),
    );
    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
};
