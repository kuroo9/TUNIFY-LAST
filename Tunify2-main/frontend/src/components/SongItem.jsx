"use client"

import { useContext, useState } from "react"
import { PlayerContext } from "../context/PlayerContext"
import { Heart, Plus, Play, Pause } from "lucide-react"
import AddToPlaylistModal from "./AddToPlaylist"
import axios from "axios"
import { useCookies } from "react-cookie"
import { url } from "../App"
import { toast } from "react-toastify"

const SongItem = ({ name, image, desc, id }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { playWithId, likedSongsIds, addLikedSong, removeLikedSong, track, playStatus, play, pause } =
    useContext(PlayerContext)
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false)
  const [cookies] = useCookies(["token"])

  // Check if this song is in the likedSongsIds array from context
  const isLiked = likedSongsIds.includes(id)
  const isPlaying = track?._id === id && playStatus

  const addSongToPlaylist = async (playlistId) => {
    try {
      const token = cookies.token
      const formData = new FormData()
      formData.append("playlistId", playlistId)
      formData.append("songId", id)

      const response = await axios.post(`${url}/api/playlist/addSong`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data._id) {
        toast.success("Song added to playlist!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setAddToPlaylistModalOpen(false)
      }
    } catch (error) {
      toast.error("Failed to add song to playlist", {
        position: "bottom-center",
        autoClose: 2000,
      })
    }
  }

  const handleAddToPlaylist = (e) => {
    e.stopPropagation()
    setAddToPlaylistModalOpen(true)
  }

  const handleLike = async (e) => {
    e.stopPropagation()

    if (!id) {
      console.error("Error: Missing songId")
      return
    }

    try {
      const token = cookies.token
      const payload = { songId: id }

      const response = await axios.post(`${url}/api/likedSongs/like-unlike`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update the global liked songs state based on the current liked status
      if (isLiked) {
        removeLikedSong(id)
        toast.info("Removed from your Liked Songs", {
          position: "bottom-center",
          autoClose: 2000,
        })
      } else {
        addLikedSong(id)
        toast.success("Added to your Liked Songs", {
          position: "bottom-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update liked status", {
        position: "bottom-center",
        autoClose: 2000,
      })
    }
  }

  const handlePlayPause = (e) => {
    e.stopPropagation()
    if (isPlaying) {
      pause()
    } else if (track?._id === id) {
      play()
    } else {
      playWithId(id)
    }
  }

  const handleCardClick = () => {
    playWithId(id)
  }

  return (
    <>
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal closeModal={() => setAddToPlaylistModalOpen(false)} addSongToPlaylist={addSongToPlaylist} />
      )}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
      >
        <div className="relative mb-3">
          <img
            className="rounded-lg w-full aspect-square object-cover shadow-lg"
            src={image || "/placeholder.svg"}
            alt={name}
          />

          {/* Play/Pause button overlay */}
          <div
            className={`absolute inset-0 bg-black/40 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity rounded-lg flex items-center justify-center`}
          >
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
            </button>
          </div>

          {/* Action buttons */}
          <div
            className={`absolute bottom-2 right-2 flex items-center gap-2 ${!isHovered && !isLiked ? "opacity-0" : "opacity-100"} transition-opacity`}
          >
            <button
              onClick={handleAddToPlaylist}
              className={`p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all transform hover:scale-110 ${!isHovered ? "hidden" : "block"}`}
              aria-label="Add to playlist"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleLike}
              className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all transform hover:scale-110"
              aria-label={isLiked ? "Unlike song" : "Like song"}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
            </button>
          </div>
        </div>
        <p className={`font-bold mb-1 truncate ${isPlaying ? "text-fuchsia-400" : "text-white"}`}>{name}</p>
        <p className="text-fuchsia-200/80 text-sm line-clamp-2">{desc}</p>
      </div>
    </>
  )
}

export default SongItem
