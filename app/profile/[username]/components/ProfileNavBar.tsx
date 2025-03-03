'use client';

export type ProfileNavBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function ProfileNavBar({
  activeTab,
  setActiveTab,
}: ProfileNavBarProps) {
  return (
    <div className="!mb-6">
      <div className="flex border-b border-gray-200">
        <button
          className={`!py-2 !px-4 ${
            activeTab === 'contact'
              ? 'border-b-2 border-blue-500 text-blue-500 bg-gray-200 rounded-lg'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Info
        </button>
        <button
          className={`!py-2 !px-4 ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-500 bg-gray-200 rounded-lg'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`!py-2 !px-4 ${
            activeTab === 'preferences'
              ? 'border-b-2 border-blue-500 text-blue-500 bg-gray-200 rounded-lg'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>
    </div>
  );
}
