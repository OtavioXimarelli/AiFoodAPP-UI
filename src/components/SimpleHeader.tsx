import React from 'react';

const SimpleHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/dashboard" className="hover:underline">Home</a></li>
            <li><a href="/profile" className="hover:underline">Profile</a></li>
            <li><a href="/settings" className="hover:underline">Settings</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SimpleHeader;
