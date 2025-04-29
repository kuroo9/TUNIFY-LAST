import React from 'react';
import { Music } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gradient-to-tr from-fuchsia-600 to-violet-700 w-8 h-8 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-200 to-violet-200">
          Artist Panel
        </h1>
      </div>
    </div>
  );
};

export default Navbar;