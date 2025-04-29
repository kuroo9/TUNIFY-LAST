import React, { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to load albums");
      }
    } catch (error) {
      console.error("Error loading albums:", error);
      toast.error("Error loading albums");
    } finally {
      setLoading(false);
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAlbums();
      } else {
        toast.error("Failed to remove album");
      }
    } catch (error) {
      console.error("Error removing album:", error);
      toast.error("Error removing album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="ml-[250px] mt-16 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">Album List</h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_2fr_auto_auto] gap-4 p-4 border-b border-white/10 bg-black/20">
              <div className="text-fuchsia-200 font-medium">Image</div>
              <div className="text-fuchsia-200 font-medium">Name</div>
              <div className="text-fuchsia-200 font-medium">Description</div>
              <div className="text-fuchsia-200 font-medium">Color</div>
              <div className="text-fuchsia-200 font-medium">Action</div>
            </div>

            <div className="divide-y divide-white/10">
              {data.map((album, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_2fr_auto_auto] gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img src={album.image} alt={album.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-white font-medium">{album.name}</div>
                  <div className="text-fuchsia-200/70">{album.desc}</div>
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <input
                      type="color"
                      value={album.bgcolor}
                      disabled
                      className="w-full h-full cursor-default"
                    />
                  </div>
                  <button
                    onClick={() => removeAlbum(album._id)}
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

export default ListAlbum;