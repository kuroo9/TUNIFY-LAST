import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Music } from 'lucide-react';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      } else {
        toast.error("Failed to load songs");
      }
    } catch (error) {
      console.error("Error loading songs:", error);
      toast.error("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs();
      } else {
        toast.error("Failed to remove song");
      }
    } catch (error) {
      console.error("Error removing song:", error);
      toast.error("Error occurred");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="ml-[250px] mt-16 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">Song List</h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 p-4 border-b border-white/10 bg-black/20">
              <div className="text-fuchsia-200 font-medium">Image</div>
              <div className="text-fuchsia-200 font-medium">Name</div>
              <div className="text-fuchsia-200 font-medium">Album</div>
              <div className="text-fuchsia-200 font-medium">Duration</div>
              <div className="text-fuchsia-200 font-medium">Action</div>
            </div>

            <div className="divide-y divide-white/10">
              {data.map((song, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden group">
                    <img src={song.image} alt={song.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{song.name}</div>
                    <div className="text-fuchsia-200/70 text-sm">{song.desc}</div>
                  </div>
                  <div className="text-fuchsia-200/70">{song.album || 'No Album'}</div>
                  <div className="text-fuchsia-200/70">{song.duration || '--:--'}</div>
                  <button
                    onClick={() => removeSong(song._id)}
                    className="p-2 text-fuchsia-200/70 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSong;