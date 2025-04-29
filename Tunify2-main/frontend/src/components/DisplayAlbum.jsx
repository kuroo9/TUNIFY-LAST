import React, { useContext, useEffect, useState } from "react"
import Navbar from "./Navbar"
import { useParams } from "react-router-dom"
import { assets } from "../assets/frontend-assets/assets"
import { PlayerContext } from "../context/PlayerContext"
import { Play, Clock, Music } from 'lucide-react'

const DisplayAlbum = () => {
  const { id } = useParams()
  const { playWithId, albumsData, songsData } = useContext(PlayerContext)
  const [albumData, setAlbumData] = useState(null)
  const [isHovering, setIsHovering] = useState(null)

  useEffect(() => {
    const album = albumsData.find((item) => item._id === id)
    setAlbumData(album)
  }, [albumsData, id])

  if (!albumData) return null

  const albumSongs = songsData.filter((song) => song.album === albumData.name)

  return (
    <>
      <Navbar />
      
      {/* Background gradient for album header */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-fuchsia-900/30 to-transparent -z-10"></div>
      
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <div className="relative group">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button 
              onClick={() => playWithId(albumSongs[0]?._id)} 
              className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110"
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </button>
          </div>
          <img 
            className="w-48 rounded-lg shadow-xl" 
            src={albumData.image || "/placeholder.svg"} 
            alt={albumData.name} 
          />
        </div>
        <div className="flex flex-col">
          <p className="text-fuchsia-200/80">Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl text-white">{albumData.name}</h2>
          <h4 className="text-fuchsia-200/80">{albumData.desc}</h4>
          <p className="mt-1 text-fuchsia-200/60 flex items-center gap-2">
            <Music className="w-4 h-4" /> 
            <span>1,34,246 likes</span> • 
            <b>{albumSongs.length} songs</b>
          </p>
        </div>
      </div>
      
      <div className="mt-10 mb-4 px-4">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 py-4 px-4 text-fuchsia-200/60 border-b border-white/10">
            <p>
              <b className="mr-4">#</b>Title
            </p>
            <p>Album</p>
            <p className="hidden sm:block">Date Added</p>
            <div className="flex justify-end">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          
          {albumSongs.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 items-center text-fuchsia-200/80 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-none"
              onClick={() => playWithId(item._id)}
              onMouseEnter={() => setIsHovering(item._id)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <div className="flex items-center">
                {isHovering === item._id ? (
                  <Play className="w-4 h-4 mr-4 text-white" />
                ) : (
                  <span className="mr-4 text-fuchsia-200/60">{index + 1}</span>
                )}
                <img className="w-10 h-10 mr-3 rounded" src={item.image || "/placeholder.svg"} alt={item.name} />
                <span className="text-white">{item.name}</span>
              </div>
              <p className="text-[15px] text-fuchsia-200/60">{albumData.name}</p>
              <p className="hidden sm:block text-fuchsia-200/60">Apr 12, 2023</p>
              <p className="text-right text-fuchsia-200/60">3:24</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default DisplayAlbum
