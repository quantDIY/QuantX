import React from 'react';

function Sidebar({ open }) {
  return (
    <aside className={`bg-gray-800 text-white w-64 p-4 space-y-4 transition-transform transform ${open ? 'translate-x-0' : '-translate-x-full'} fixed h-full z-50`}>
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-2">
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Dashboard</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Trades</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Settings</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Tests</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
