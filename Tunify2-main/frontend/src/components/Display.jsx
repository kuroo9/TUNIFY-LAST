import React, { useContext, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum';
import { PlayerContext } from '../context/PlayerContext';
import SearchPage from './SearchPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import CreatePlaylistPage from './CreatePlaylist';
import PlaylistsPage from './PlaylistsPage';
import PlaylistDetailPage from './PlaylistDetailPage';
import LikedSongsPage from './LikedSongsPage';
import WelcomePage from './WelcomePage';




const Display = () => {

  const { albumsData } = useContext(PlayerContext);

  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split('/').pop() : "";
  const bgColor = isAlbum && albumsData.length > 0 ? albumsData.find((x) => (x._id == albumId)).bgColour : "#121212";

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`
    }
    else {
      displayRef.current.style.background = `#121212`
    }
  })

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      {albumsData.length > 0
        ?
        <Routes>
          <Route path='/home' element={<DisplayHome />} />
          {/* <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/' element={<WelcomePage />} /> */}
          <Route path="/playlists" element={< PlaylistsPage/>} />
          <Route path="/likedSongs" element={< LikedSongsPage/>} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
          <Route path='/create-playlist' element={<CreatePlaylistPage />} />
          <Route path='/album/:id' element={<DisplayAlbum album={albumsData.find((x) => (x._id == albumId))} />} />
          <Route path='/search' element={<SearchPage />} />
        </Routes>
        : null
      }

    </div>
  )
}

export default Display