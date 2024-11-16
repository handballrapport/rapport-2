import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { path: 'competition', name: 'Competition' },
  { path: 'teams', name: 'Teams' },
  { path: 'games', name: 'Games' },
  { path: 'live-events', name: 'Live Events' },
  { path: 'events', name: 'Events' },
  { path: 'reports', name: 'Reports' }
];

const getClassNames = (isActive) => {
  const baseClasses = "p-1 font-semibold rounded-sm text-white w-26 px-2 border border-transparent";
  const activeClasses = "border-2 border-black/10 bg-[#ed3e55]";
  const inactiveClasses = "bg-[#3451a8]/90  hover:bg-[#3451a8] ";
  return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
};

const Sidebar = () => {
  return (
    <div className="text-black h-full w-32 py-6">
      <nav className="flex flex-col space-y-2 justify-center ">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => getClassNames(isActive)}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
