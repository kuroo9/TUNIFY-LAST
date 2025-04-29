import { Routes, Route } from "react-router-dom";
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SideBar from './components/SideBar/';
import Player from './components/Player';
import Display from './components/Display';
import { PlayerContext } from './context/PlayerContext';
import { useContext } from 'react';
import { UserData, UserProvider } from './context/User';
import { CookiesProvider } from "react-cookie";
export const url='http://localhost:4000'
const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);
  const { isAuth } = UserData();

  return (
    <CookiesProvider>
      <UserProvider>
    <div className="h-screen w-screen bg-gradient-to-b from-black to-[#121212]">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected route */}
        <Route path="/*" element={
          isAuth ? (
            <>
              <div className="h-[90%] flex">
                <SideBar />
                <Display /> {/* <- Display has its own Routes inside */}
              </div>
              <Player />
              <audio ref={audioRef} src={track ? track.file : ""} preload="auto"></audio>
            </>
          ) : (
            <WelcomePage />
          )
        } />
      </Routes>
    </div>
    </UserProvider>
    </CookiesProvider>
  );
};

export default App;
