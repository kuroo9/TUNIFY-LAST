"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Play } from "lucide-react"

const AlbumItem = ({ name, desc, id, image }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/album/${id}`)}
      className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
    >
      <div className="relative mb-3">
        <img
          className="rounded-lg w-full aspect-square object-cover shadow-lg"
          src={image || "/placeholder.svg"}
          alt={name}
        />

        {/* Play button overlay */}
        <div
          className={`absolute inset-0 bg-black/40 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity rounded-lg flex items-center justify-center`}
        >
          <button className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>
      </div>
      <p className="font-bold mb-1 truncate text-white">{name}</p>
      <p className="text-fuchsia-200/80 text-sm line-clamp-2">{desc}</p>
    </div>
  )
}

export default AlbumItem
