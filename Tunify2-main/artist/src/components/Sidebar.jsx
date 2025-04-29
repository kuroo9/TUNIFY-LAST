import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music, PlusCircle, ListMusic, FolderPlus, Folders } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/add-song', icon: <PlusCircle className="w-5 h-5" />, label: 'Add Song' },
   
    { to: '/add-album', icon: <FolderPlus className="w-5 h-5" />, label: 'Add Album' },
  
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[250px] bg-black/80 backdrop-blur-xl border-r border-white/5 px-3 py-6">
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gradient-to-tr from-fuchsia-600 to-violet-700 w-10 h-10 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="text-lg font-semibold text-white">Tunify Artist</span>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 text-white'
                  : 'text-fuchsia-200/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;