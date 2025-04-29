"use client"

import { useState, useEffect, useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"
import { useNavigate } from "react-router-dom"
import { Search, X, Play } from "lucide-react"

const SearchPage = () => {
  const { songsData, albumsData, playWithId } = useContext(PlayerContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
  })
  const navigate = useNavigate()

  // Search algorithm to filter songs and albums
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ songs: [], albums: [] })
      return
    }

    const query = searchQuery.toLowerCase()

    // Filter songs
    const filteredSongs = songsData.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.artist?.toLowerCase().includes(query) ||
        song.desc?.toLowerCase().includes(query),
    )

    // Filter albums
    const filteredAlbums = albumsData.filter(
      (album) =>
        album.title?.toLowerCase().includes(query) ||
        album.name?.toLowerCase().includes(query) ||
        album.desc?.toLowerCase().includes(query),
    )

    setSearchResults({
      songs: filteredSongs,
      albums: filteredAlbums,
    })
  }, [searchQuery, songsData, albumsData])

  return (
    <div className="flex flex-col h-full">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-violet-900/20 to-transparent -z-10"></div>

      {/* Search Input */}
      <div className="sticky top-0 bg-transparent backdrop-blur-md py-4 z-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-fuchsia-300" />
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-12 pr-10 text-white bg-white/10 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="absolute inset-y-0 right-0 flex items-center pr-4" onClick={() => setSearchQuery("")}>
              <X className="w-5 h-5 text-fuchsia-300 hover:text-white transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-4 flex-1 overflow-auto">
        {searchQuery.trim() === "" ? (
          <div className="flex flex-col items-center justify-center h-full text-fuchsia-200/60">
            <Search className="w-16 h-16 mb-4 text-fuchsia-400/50" />
            <div className="text-xl font-bold mb-2 text-white">Search for songs or albums</div>
            <div className="text-sm">Find your favorite music</div>
          </div>
        ) : (
          <div>
            {/* Songs Results */}
            {searchResults.songs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Songs</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.songs.slice(0, 8).map((song) => (
                    <div
                      key={song._id}
                      className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => playWithId(song._id)}
                    >
                      <div className="relative group mb-4">
                        <img
                          src={song.image || "/placeholder.svg"}
                          alt={song.name}
                          className="w-full aspect-square object-cover rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold truncate text-white">{song.name}</h3>
                      <p className="text-fuchsia-200/60 text-sm truncate">{song.artist || song.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums Results */}
            {searchResults.albums.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.albums.slice(0, 8).map((album) => (
                    <div
                      key={album._id}
                      className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => navigate(`/album/${album._id}`)}
                    >
                      <div className="relative group mb-4">
                        <img
                          src={album.image || "/placeholder.svg"}
                          alt={album.title}
                          className="w-full aspect-square object-cover rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold truncate text-white">{album.title || album.name}</h3>
                      <p className="text-fuchsia-200/60 text-sm truncate">{album.artist || "Album"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.songs.length === 0 && searchResults.albums.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-16 text-fuchsia-200/60">
                <div className="text-xl font-bold mb-2 text-white">No results found for "{searchQuery}"</div>
                <div className="text-sm">Try different keywords or check your spelling</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
