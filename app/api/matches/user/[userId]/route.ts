import { NextResponse } from 'next/server';
import { getUserMatchesFromDatabase } from '../../../../../database/matches';

export const GET = async (request: any) => {
  // get the user id from the request
  const userId = request.query.userId as string;
  try {
    // get the user's matches
    const matches = await getUserMatchesFromDatabase(parseInt(userId));
    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
};
