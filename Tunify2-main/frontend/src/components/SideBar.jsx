"use client"

import { useState } from "react"
import { assets } from "../assets/frontend-assets/assets"
import { useNavigate, useLocation } from "react-router-dom"
import PlaylistsPage from "./PlaylistsPage"
import { Home, Search, Library, Plus, ChevronDown, ChevronUp, Heart } from 'lucide-react'

const SideBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true)

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      navigate("/search")
    }
  }

  const isSearchActive = location.pathname.includes("search")
  const isLikedSongsActive = location.pathname.includes("likedSongs")

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      {/* Home and Search section */}
      <div className="bg-black/20 backdrop-blur-xl h-[15%] rounded-xl border border-white/5 flex flex-col justify-around">
        <div 
          onClick={() => navigate("/home")} 
          className="flex items-center gap-3 pl-8 cursor-pointer py-3 hover:text-fuchsia-300 transition-colors"
        >
          <Home className="w-6 h-6" />
          <p className="font-bold">Home</p>
        </div>
        <div
          onClick={toggleSearch}
          className={`flex items-center gap-3 pl-8 cursor-pointer py-3 hover:text-fuchsia-300 transition-colors ${isSearchActive ? "text-fuchsia-400" : ""}`}
        >
          <Search className="w-6 h-6" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      {/* Library section */}
      <div className={`bg-black/20 backdrop-blur-xl ${isLibraryExpanded ? "flex-1" : "h-auto"} rounded-xl border border-white/5 flex flex-col`}>
        {/* Library header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:text-fuchsia-300 transition-colors">
            <Library className="w-6 h-6" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/50 transition-all"
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
            >
              {isLibraryExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/50 transition-all"
              onClick={() => navigate("/create-playlist")}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Playlists section */}
        <div className="flex-1 flex flex-col overflow-hidden px-2">
          {/* Create Playlist option */}
          <div 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            onClick={() => navigate("/create-playlist")}
          >
            <div className="bg-gradient-to-br from-fuchsia-500 to-violet-600 p-2 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Create playlist</span>
          </div>

          {/* Liked Songs option */}
          <div
            onClick={() => navigate("/likedSongs")}
            className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer hover:bg-white/5 ${isLikedSongsActive ? "bg-white/10" : ""}`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center rounded-lg">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <p className="font-semibold">Liked Songs</p>
              <p className="text-xs text-gray-400">Playlist • Your favorite tracks</p>
            </div>
          </div>

          {/* Playlists list */}
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-gray-400 px-2 py-3 uppercase tracking-wider">
              Your Playlists
            </h3>
            <div className="overflow-y-auto">
              <PlaylistsPage vertical={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
