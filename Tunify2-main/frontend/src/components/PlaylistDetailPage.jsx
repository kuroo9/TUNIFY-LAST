"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PlayerContext } from "../context/PlayerContext"
import { useCookies } from "react-cookie"
import axios from "axios"
import { url } from "../App"
import { toast } from "react-toastify"
import { Play, Pause, Clock, Edit2, MoreHorizontal, Save, X, Music, Heart, Share2, Calendar } from "lucide-react"

const PlaylistDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playWithId, track, playStatus, play, pause } = useContext(PlayerContext)
  const [cookies] = useCookies(["token"])
  const contentRef = useRef(null)

  const [playlist, setPlaylist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isHovering, setIsHovering] = useState(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  })

  // Animation effect
  useEffect(() => {
    const content = contentRef.current
    if (content) {
      content.style.opacity = "0"
      content.style.transform = "translateY(20px)"

      setTimeout(() => {
        content.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
        content.style.opacity = "1"
        content.style.transform = "translateY(0)"
      }, 300)
    }
  }, [])

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      setIsLoading(true)
      try {
        const token = cookies.token
        const response = await axios.get(`${url}/api/playlist/mysongs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response);
        setPlaylist(response.data)
          
          setTracks(response.data.songs)
        if (response.data.success) {
          
          setEditForm({
            name: response.data.name,
            description: response.data.desc || "",
          })
        } else {
          toast.error("Failed to load playlist")
        }
      } catch (error) {
        console.error("Error fetching playlist details:", error)
        toast.error("Error loading playlist")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaylistDetails()
  }, [id, cookies.token])

  const handleEditSubmit = async (e) => {
    e.preventDefault()

      try {
              // Simulate API delay
              await new Promise((resolve) => setTimeout(resolve, 800))
        
              // Update local state
              setPlaylist({
                ...playlist,
                name: editForm.name,
                description: editForm.description,
                updatedAt: new Date().toISOString(),
              })
        
              // Exit edit mode
              setIsEditing(false)
            } catch (error) {
              console.error("Error updating playlist:", error)
            }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value,
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const handlePlayPause = (songId) => {
    if (track?._id === songId && playStatus) {
      pause()
    } else if (track?._id === songId) {
      play()
    } else {
      playWithId(songId)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-white/10 w-48 h-48 rounded-lg"></div>
          <div className="flex-1">
            <div className="bg-white/10 h-8 w-48 rounded mb-4"></div>
            <div className="bg-white/10 h-6 w-96 rounded mb-2"></div>
            <div className="bg-white/10 h-4 w-64 rounded"></div>
          </div>
        </div>

        <div className="bg-white/10 h-10 w-full rounded mb-6"></div>

        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-white/10">
              <div className="bg-white/10 h-4 w-4 rounded"></div>
              <div className="bg-white/10 h-12 w-12 rounded"></div>
              <div className="flex-1">
                <div className="bg-white/10 h-5 w-48 rounded mb-2"></div>
                <div className="bg-white/10 h-4 w-32 rounded"></div>
              </div>
              <div className="bg-white/10 h-4 w-16 rounded"></div>
            </div>
          ))}
      </div>
    )
  }

  if (!playlist) {
    return (
      
      <div className="flex flex-col items-center justify-center py-16">
        <Music className="w-16 h-16 text-fuchsia-400/50 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-white">Playlist not found</h2>
        <p className="text-fuchsia-200/60 mb-6">The playlist you're looking for doesn't exist or has been removed</p>
        <button
          onClick={() => navigate("/playlists")}
          className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white rounded-full hover:from-fuchsia-400 hover:to-violet-400 transition-colors font-medium"
        >
          Go to Your Playlists
        </button>
      </div>
    )
  }

  return (
    <div ref={contentRef} className="pb-20">
      {/* Background gradient for playlist header */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-fuchsia-900/30 to-transparent -z-10"></div>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <div className="w-48 h-48 shadow-xl rounded-lg overflow-hidden">
          <img src={playlist.image || "/placeholder.svg"} alt={playlist.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-sm uppercase font-bold text-fuchsia-200/80">Playlist</p>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="bg-white/10 text-white text-4xl font-bold mb-4 w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none border border-white/10"
                placeholder="Playlist name"
                required
              />
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                className="bg-white/10 text-white w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none resize-none border border-white/10"
                placeholder="Add an optional description"
                rows={3}
              ></textarea>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white rounded-full hover:from-fuchsia-400 hover:to-violet-400 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditForm({
                      name: playlist.name,
                      description: playlist.desc || "",
                    })
                  }}
                  className="px-4 py-2 bg-black/30 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-black/40 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4 text-white">{playlist.name}</h1>
              <p className="text-fuchsia-200/60 mb-2">{playlist.desc}</p>
              <div className="flex flex-wrap items-center gap-1 text-sm text-fuchsia-200/60">
                <span className="font-semibold text-fuchsia-200">{playlist.owner}</span>
                <span>•</span>
                <span>{tracks.length} songs</span>
                {playlist.createdAt && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(playlist.createdAt)}
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => tracks.length > 0 && playWithId(tracks[0]._id)}
          className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full hover:from-fuchsia-400 hover:to-violet-400 transition-colors shadow-lg"
        >
          <Play className="w-6 h-6 text-white ml-1" />
        </button>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-fuchsia-200 hover:text-white hover:bg-black/40 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-fuchsia-200 hover:text-white hover:bg-black/40 transition-colors">
          <Heart className="w-4 h-4" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-fuchsia-200 hover:text-white hover:bg-black/40 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-fuchsia-200 hover:text-white hover:bg-black/40 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tracks Table */}
      <div className="w-full">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)] gap-4 px-4 py-3 border-b border-white/10 text-fuchsia-200/60 text-sm">
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-right">
              <Clock className="w-4 h-4 inline-block" />
            </div>
          </div>

          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <div
                key={track._id}
                className="grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)] gap-4 px-4 py-3 border-b border-white/5 last:border-none hover:bg-white/5 group"
                onMouseEnter={() => setIsHovering(track._id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="flex items-center justify-center text-fuchsia-200/60">
                  {isHovering === track._id ? (
                    <button onClick={() => handlePlayPause(track._id)} className="text-white">
                      {track?._id === track._id && playStatus ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.image || "/placeholder.svg"}
                    alt={track.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{track.name}</div>
                    <div className="text-fuchsia-200/60 text-sm truncate">{track.desc}</div>
                  </div>
                </div>
                <div className="flex items-center text-fuchsia-200/60 truncate">{track.album || "Single"}</div>
                <div className="flex items-center justify-end text-fuchsia-200/60">{track.duration || "3:24"}</div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-fuchsia-200/60">
              <Music className="w-16 h-16 mb-4 text-fuchsia-400/30" />
              <p className="text-lg font-medium mb-2 text-white">This playlist is empty</p>
              <p className="text-sm">Add songs to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaylistDetailPage