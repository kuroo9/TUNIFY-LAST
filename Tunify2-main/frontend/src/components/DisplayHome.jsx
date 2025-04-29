import React, { useContext } from 'react'
import Navbar from './Navbar'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
import { PlayerContext } from '../context/PlayerContext'

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext)

  return (
    <>
      <Navbar />
      
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-fuchsia-900/30 to-transparent -z-10"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className='mb-8'>
        <h1 className='my-5 font-bold text-2xl text-white'>Featured Charts</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {albumsData.map((item, index) => (
            <AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
          ))}
        </div>
      </div>
      
      <div className='mb-8'>
        <h1 className='my-5 font-bold text-2xl text-white'>Today's Biggest Hits</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {songsData.map((item, index) => (
            <SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
          ))}
        </div>
      </div>
    </>
  )
}

export default DisplayHome
