import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import PlayerContextProvider from './context/PlayerContext.jsx'
import { CookiesProvider } from 'react-cookie'
import { UserProvider } from './context/User.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <CookiesProvider>
      <UserProvider>
      <PlayerContextProvider>
        <App />
      </PlayerContextProvider>
      </UserProvider>
      </CookiesProvider>
      
    </BrowserRouter>
  </StrictMode>,
)