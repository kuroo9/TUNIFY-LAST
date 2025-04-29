import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";


export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const volumeBg = useRef();
  const volumeBar = useRef();
   const [cookies] = useCookies(["token"])


  const url = "http://localhost:4000"; // Ensure this is correct

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [likedSongsIds, setLikedSongsIds] = useState([]) // Store just the IDs of liked songs

  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume is 100%
  const [prevVolume, setPrevVolume] = useState(1); // Store previous volume for mute toggle
  const [isMuted, setIsMuted] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });



  const fetchlikedSongDetails = async () => {
    // setIsLoading(true)
    try {
      // Simulate API delay
      console.log(cookies)
              let token=cookies.token;
              console.log(`${url}/api/likedSongs/liked`)
              // Simulate API delay
              // await new Promise((resolve) => setTimeout(resolve, 1000))
              const response = await axios.get(`${url}/api/likedSongs/liked`, {
                headers: {
                  // 'Content-Type': 'multipart/form-data', // 🛠️ Important
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(response.data.likedSongs);
              // setLikedSongs(response.data.likedSongs);
              if (response.data && response.data.likedSongs) {
                // Extract just the song IDs from the response
                const likedIds = response.data.likedSongs.map((song) => song._id || song.songId)
                setLikedSongsIds(likedIds)
              }

      // Mock data - in a real app, this would come from your A

    //   setPlaylist(response.data)
    //   setTracks(response.data.songs)
    } catch (error) {
      console.error("Error fetching likedSongs details:", error)
    }
  }



  const addLikedSong = (songId) => {
    if (!likedSongsIds.includes(songId)) {
      setLikedSongsIds((prev) => [...prev, songId])
    }
  }

  // Remove a song from liked songs
  const removeLikedSong = (songId) => {
    setLikedSongsIds((prev) => prev.filter((id) => id !== songId))
  }
  const play = () => {
    if (audioRef.current && track?.audio) {
      audioRef.current.play().catch((err) => console.error("Audio play error:", err));
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id) => {
    const selectedTrack = songsData.find((item) => item._id === id);
    if (selectedTrack) {
      setTrack(selectedTrack);
    }
  };

  const previous = () => {
    const index = songsData.findIndex((item) => item._id === track?._id);
    if (index > 0) {
      setTrack(songsData[index - 1]);
    }
  };

  const next = () => {
    const index = songsData.findIndex((item) => item._id === track?._id);
    if (index < songsData.length - 1) {
      setTrack(songsData[index + 1]);
    }
  };

  const seekSong = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  // New volume control functions
  const changeVolume = (e) => {
    if (audioRef.current) {
      const newVolume = Math.max(0, Math.min(1, e.nativeEvent.offsetX / volumeBg.current.offsetWidth));
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
      
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      } else if (newVolume === 0) {
        setIsMuted(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmute
        audioRef.current.volume = prevVolume;
        setVolume(prevVolume);
        setIsMuted(false);
      } else {
        // Mute
        setPrevVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      const fetchedSongs = response.data.songs.map((song) => ({
        ...song,
        audio: song.audio.startsWith("http") ? song.audio : `${url}/${song.audio}`,
      }));
      setSongsData(fetchedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleLogout = () => {
    pause();        // Stop audio playback
    setTrack(null); // Clear current track
    // ... other logout logic
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  useEffect(() => {
    if (audioRef.current && track?.audio) {
      audioRef.current.src = track.audio; // Ensure audio source updates
      audioRef.current.load();
      audioRef.current.volume = volume; // Set volume when track changes
      play();
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0'),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0'),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }
  }, [audioRef]);

  // Update volume bar width when volume changes
  useEffect(() => {
    if (volumeBar.current) {
      volumeBar.current.style.width = `${volume * 100}%`;
    }
  }, [volume]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    volumeBar,
    volumeBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    volume,
    setVolume,
    isMuted,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    changeVolume,
    toggleMute,
    songsData,
    albumsData,
    likedSongsIds,
    addLikedSong,
    removeLikedSong,
    fetchlikedSongDetails,
  };

  return (
    
    <PlayerContext.Provider value={contextValue}>
      {props.children}
      {/* Add Hidden Audio Element */}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;