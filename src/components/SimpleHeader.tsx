import React from 'react';
import { Link } from 'react-router-dom';

const SimpleHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/dashboard" className="hover:underline">Home</Link></li>
            <li><Link to="/dashboard/profile" className="hover:underline">Profile</Link></li>
            <li><Link to="/dashboard/settings" className="hover:underline">Settings</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SimpleHeader;
