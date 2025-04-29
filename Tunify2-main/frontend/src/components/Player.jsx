"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { PlayerContext } from "../context/PlayerContext"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume, Volume1, Volume2, VolumeX } from "lucide-react"

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    volumeBar,
    volumeBg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
    volume,
    isMuted,
    changeVolume,
    toggleMute,
  } = useContext(PlayerContext)

  const [isHoveringSeek, setIsHoveringSeek] = useState(false)
  const [isHoveringVolume, setIsHoveringVolume] = useState(false)

  // Update seekbar width based on current time
  useEffect(() => {
    if (seekBar.current && time.currentTime && time.totalTime) {
      const progress =
        ((time.currentTime.minute * 60 + time.currentTime.second) /
          (time.totalTime.minute * 60 + time.totalTime.second)) *
        100
      seekBar.current.style.width = `${progress}%`
    }
  }, [time, seekBar])

  // Update volume bar width
  useEffect(() => {
    if (volumeBar.current) {
      volumeBar.current.style.width = `${volume * 100}%`
    }
  }, [volume, volumeBar])

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-5 h-5" />
    } else if (volume < 0.3) {
      return <Volume className="w-5 h-5" />
    } else if (volume < 0.7) {
      return <Volume1 className="w-5 h-5" />
    } else {
      return <Volume2 className="w-5 h-5" />
    }
  }

  return track ? (
    <div className="h-[10%] bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12 h-12 rounded" src={track.image || "/placeholder.svg"} alt="" />
        <div>
          <p className="text-white font-medium">{track.name}</p>
          <p className="text-fuchsia-200/60 text-sm">{track.desc.slice(0, 20)}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4 items-center">
          <button className="text-fuchsia-200/60 hover:text-fuchsia-200 transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={previous} className="text-fuchsia-200 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={playStatus ? pause : play}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
          >
            {playStatus ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button onClick={next} className="text-fuchsia-200 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="text-fuchsia-200/60 hover:text-fuchsia-200 transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-fuchsia-200/60 w-10 text-right">
            {Math.floor(time.currentTime.minute) || 0}:
            {String(Math.floor(time.currentTime.second) || 0).padStart(2, "0")}
          </p>
          <div
            ref={seekBg}
            onClick={seekSong}
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
            className="w-[60vw] max-w-[500px] h-1 bg-white/20 rounded-full cursor-pointer group relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div
                ref={seekBar}
                className="h-1 border-none bg-fuchsia-500 rounded-full group-hover:bg-fuchsia-400 transition-colors"
                style={{ width: "0%" }} // Initial width, will be updated by useEffect
              />
            </div>
            {isHoveringSeek && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full transition-opacity"
                style={{
                  left: `${seekBar.current ? seekBar.current.style.width : "0%"}`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
          <p className="text-xs text-fuchsia-200/60 w-10">
            {Math.floor(time.totalTime.minute) || 0}:{String(Math.floor(time.totalTime.second) || 0).padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-fuchsia-200/60 hover:text-fuchsia-200 transition-colors">
            {getVolumeIcon()}
          </button>
          <div
            ref={volumeBg}
            onClick={changeVolume}
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
            className="w-20 bg-white/20 h-1 rounded-full cursor-pointer group relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div
                ref={volumeBar}
                className="h-1 border-none bg-fuchsia-500 rounded-full group-hover:bg-fuchsia-400 transition-colors"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            {isHoveringVolume && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full transition-opacity"
                style={{
                  left: `${volume * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default Player