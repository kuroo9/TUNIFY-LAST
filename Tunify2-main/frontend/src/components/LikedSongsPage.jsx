"use client"

import { useContext, useState, useEffect } from "react"
import { PlayerContext } from "../context/PlayerContext"
import { Heart, Clock, MoreHorizontal, Play, Pause } from 'lucide-react'
import { useCookies } from "react-cookie"
import { url } from "../App"
import axios from "axios"

const LikedSongsPage = () => {
  const { songsData, playWithId, track, playStatus, play, pause } = useContext(PlayerContext)
  const [likedSongs, setLikedSongs] = useState([])
  const [isHovering, setIsHovering] = useState(null)
  const [cookies] = useCookies(["token"])

  useEffect(() => {
    const fetchlikedSongDetails = async () => {
      try {
        console.log(cookies)
        let token = cookies.token
        console.log(`${url}/api/likedSongs/liked`)
        const response = await axios.get(`${url}/api/likedSongs/liked`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data.likedSongs)
        setLikedSongs(response.data.likedSongs)
      } catch (error) {
        console.error("Error fetching playlist details:", error)
      }
    }

    fetchlikedSongDetails()
  }, [])

  const handlePlayPause = (songId) => {
    if (track?._id === songId && playStatus) {
      pause()
    } else if (track?._id === songId) {
      play()
    } else {
      playWithId(songId)
    }
  }

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Header with gradient background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/40 to-transparent -z-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center shadow-xl rounded-lg">
            <Heart className="w-24 h-24 text-white" fill="white" />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-fuchsia-200/80 uppercase">Playlist</p>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 text-white">Liked Songs</h1>
            <div className="text-sm text-fuchsia-200/80">
              <span>{likedSongs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="w-full overflow-x-auto px-6">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-fuchsia-200/60">
                <th className="py-3 pl-4">#</th>
                <th className="py-3">Title</th>
                <th className="py-3 hidden md:table-cell">Album</th>
                <th className="py-3 hidden lg:table-cell">Date added</th>
                <th className="py-3 pr-8 text-center">
                  <Clock className="inline-block w-4 h-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {likedSongs.map((song, index) => (
                <tr
                  key={song._id}
                  className="hover:bg-white/5 group border-b border-white/5 last:border-none"
                  onMouseEnter={() => setIsHovering(song._id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <td className="py-3 pl-4 w-10">
                    {isHovering === song._id ? (
                      <button onClick={() => handlePlayPause(song._id)} className="text-white">
                        {track?._id === song._id && playStatus ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className={`${track?._id === song._id ? "text-fuchsia-400" : "text-fuchsia-200/60"}`}>
                        {index + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <img src={song.image || "/placeholder.svg"} alt={song.name} className="w-10 h-10 mr-3 rounded" />
                      <div>
                        <p className={`font-medium ${track?._id === song._id ? "text-fuchsia-400" : "text-white"}`}>
                          {song.name}
                        </p>
                        <p className="text-sm text-fuchsia-200/60">{song.desc || "Unknown Artist"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 hidden md:table-cell text-fuchsia-200/60">{song.album || "Single"}</td>
                  <td className="py-3 hidden lg:table-cell text-fuchsia-200/60">{song.dateAdded}</td>
                  <td className="py-3 pr-8 text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-fuchsia-200/60 mr-4">{song.duration}</span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-5 h-5 text-fuchsia-200/60" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {likedSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-fuchsia-200/60 mt-8">
          <Heart className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Songs you like will appear here</h2>
          <p>Save songs by tapping the heart icon</p>
        </div>
      )}
    </div>
  )
}

export default LikedSongsPage
