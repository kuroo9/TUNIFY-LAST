"use client"

import { useState, useEffect } from "react"
import { url } from "../App"
import axios from "axios"
import { useCookies } from "react-cookie"
import { X, Music, Plus } from "lucide-react"

const AddToPlaylistModal = ({ closeModal, addSongToPlaylist }) => {
  const [myPlaylists, setMyPlaylists] = useState([])
  const [cookies] = useCookies(["token"])

  useEffect(() => {
    const getData = async () => {
      const token = cookies.token
      const response = await axios.get(`${url}/api/playlist/myplaylists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMyPlaylists(response.data.data)
    }
    getData()
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-gradient-to-b from-violet-950/90 to-fuchsia-900/90 backdrop-blur-xl w-full max-w-md rounded-xl shadow-xl p-6 border border-white/10"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">Select Playlist</h3>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/50 transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-fuchsia-600 scrollbar-track-black/20">
          {myPlaylists.length === 0 ? (
            <div className="text-fuchsia-200/60 text-center py-8 flex flex-col items-center">
              <Music className="w-12 h-12 mb-3 text-fuchsia-400/50" />
              <p className="text-lg font-medium mb-1">No playlists found</p>
              <p className="text-sm">Create a playlist to add songs</p>
            </div>
          ) : (
            myPlaylists.map((item) => (
              <PlaylistListComponent key={item._id} info={item} addSongToPlaylist={addSongToPlaylist} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const PlaylistListComponent = ({ info, addSongToPlaylist }) => {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
      onClick={() => addSongToPlaylist(info._id)}
    >
      <div className="flex-shrink-0 relative">
        <img
          src={
            info.image ||
            "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          className="w-12 h-12 rounded-md object-cover"
          alt={info.name}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-white font-semibold text-sm truncate">{info.name}</div>
        <div className="text-fuchsia-200/60 text-xs">{info.songs?.length || 0} songs</div>
      </div>
    </div>
  )
}

export default AddToPlaylistModal
