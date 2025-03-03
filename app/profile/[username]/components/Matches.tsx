'use client';

import Link from 'next/link';
import { useState } from 'react';

export type MatchesProps = {
  matchCount: number;
  matchArray: { id: string; username: string }[];
  pendingRequests: any[];
};

export default function Matches({
  matchCount,
  matchArray,
  pendingRequests,
}: MatchesProps) {
  const [isMatchVisible, setIsMatchVisible] = useState(false);

  const showMatchesHandler = () => {
    setIsMatchVisible(!isMatchVisible);
  };

  return (
    <div className="space-y-4">
      {/* Matches Button */}
      <button
        onClick={showMatchesHandler}
        className="w-full py-2 bg-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-600 hover:text-gray-100"
      >
        {matchCount} Matches
      </button>

      {/* Conditional Rendering to Show Matches */}
      {isMatchVisible && (
        <div>
          {matchArray.map((match) => (
            <div key={match.id}>{match.username}</div>
          ))}
        </div>
      )}

      {/* Pending Requests Button */}
      <button className="w-full py-2 bg-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-600 hover:text-gray-100 mt-2">
        {pendingRequests?.length || 0} Pending Requests
      </button>

      {/* Social Links */}
      <div className="flex space-x-4 mt-4">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          {' '}
          Twitter{' '}
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          {' '}
          Facebook{' '}
        </Link>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          {' '}
          LinkedIn{' '}
        </Link>
      </div>
    </div>
  );
}
