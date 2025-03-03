import Link from 'next/link';
import React, { useEffect } from 'react';

interface PreferencesProps {
  isShredding: boolean;
  setIsShredding: React.Dispatch<React.SetStateAction<boolean>>;
  isBulking: boolean;
  setIsBulking: React.Dispatch<React.SetStateAction<boolean>>;
  isExperienced: boolean;
  setIsExperienced: React.Dispatch<React.SetStateAction<boolean>>;
  potentialBuddies: any[];
  user: any;
}

const Preferences: React.FC<PreferencesProps> = ({
  isShredding,
  setIsShredding,
  isBulking,
  setIsBulking,
  isExperienced,
  setIsExperienced,
  potentialBuddies,
  user,
}) => {
  useEffect(() => {
    // Check if preferences are already in localStorage and set them in state
    const storedShredding = localStorage.getItem('isShredding');
    const storedBulking = localStorage.getItem('isBulking');
    const storedExperienced = localStorage.getItem('isExperienced');

    if (storedShredding !== null) {
      setIsShredding(JSON.parse(storedShredding));
    }
    if (storedBulking !== null) {
      setIsBulking(JSON.parse(storedBulking));
    }
    if (storedExperienced !== null) {
      setIsExperienced(JSON.parse(storedExperienced));
    }
  }, [setIsShredding, setIsBulking, setIsExperienced]);

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    key: string,
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setter(newValue);
      localStorage.setItem(key, JSON.stringify(newValue)); // Store the new value in localStorage
    };
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          Notification Preferences
        </h3>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isShredding}
            onChange={handleCheckboxChange(setIsShredding, 'isShredding')}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-gray-400">Shredding</span>
        </label>

        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={isBulking}
            onChange={handleCheckboxChange(setIsBulking, 'isBulking')}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-gray-400">Bulking</span>
        </label>

        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={isExperienced}
            onChange={handleCheckboxChange(setIsExperienced, 'isExperienced')}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-gray-400">Experienced</span>
        </label>
      </div>

      {/* Potential Gym Buddies Section */}
      <div className="mt-8 text-center">
        <p className="text-lg font-medium text-gray-400">
          {potentialBuddies.length} Potential Gym Buddies
        </p>
        <Link
          className="flex justify-center"
          href={{
            pathname: `/profile/${user.username}/potential-buddies`,
          }}
        >
          <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold !py-2 !px-4 rounded-lg transition duration-300 w-30 flex items-center justify-center">
            Let's Go!
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Preferences;
