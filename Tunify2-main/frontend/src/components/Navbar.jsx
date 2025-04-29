import React, { useContext } from 'react'
import { assets } from '../assets/frontend-assets/assets'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../context/User'
import { ChevronLeft, ChevronRight, Sparkles, Download, LogOut, LogIn } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuth, logoutUser } = UserData()

  return (
    <>
      <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
          <button 
            onClick={() => navigate(-1)} 
            className='w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur-md hover:bg-black/40 p-2 rounded-full cursor-pointer transition-all'
          >
            <ChevronLeft className="w-5 h-5 text-fuchsia-100" />
          </button>
          <button 
            onClick={() => navigate(+1)} 
            className='w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur-md hover:bg-black/40 p-2 rounded-full cursor-pointer transition-all'
          >
            <ChevronRight className="w-5 h-5 text-fuchsia-100" />
          </button>
        </div>
        <div className='flex items-center gap-4'>
          <button className='bg-black/20 backdrop-blur-md text-fuchsia-100 text-[15px] px-4 py-1.5 rounded-full hidden md:flex items-center gap-1.5 hover:bg-black/30 transition-all'>
            <Sparkles className="w-4 h-4 text-fuchsia-300" />
            <span></span>
          </button>
          <button className='bg-black/20 backdrop-blur-md text-fuchsia-100 text-[15px] px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/30 transition-all'>
            <Download className="w-4 h-4 text-fuchsia-300" />
            <span></span>
          </button>
          
          {isAuth ? (
            <button 
              onClick={logoutUser} 
              className='bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all'
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate("/login")} 
              className='bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all'
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <button className='bg-white text-black px-4 py-1.5 rounded-full font-medium'>All</button>
        <button className='bg-black/20 backdrop-blur-md text-fuchsia-100 px-4 py-1.5 rounded-full hover:bg-black/30 transition-all'>Music</button>
        <button className='bg-black/20 backdrop-blur-md text-fuchsia-100 px-4 py-1.5 rounded-full hover:bg-black/30 transition-all'>Podcasts</button>
      </div>
    </>
  )
}

export default Navbar
