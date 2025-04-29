import React, { useState, useEffect } from 'react';
import { Upload, Music, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../App';

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  useEffect(() => {
    const loadAlbumData = async () => {
      try {
        const response = await axios.get(`${url}/api/album/list`);
        if (response.data.success) {
          setAlbumData(response.data.albums);
        }
      } catch (error) {
        console.error("Error loading album data:", error);
        toast.error("Error loading album data");
      }
    };

    loadAlbumData();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image || !song) {
      toast.error("Please select both image and audio file");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('audio', song);
      formData.append('album', album);

      const response = await axios.post(`${url}/api/song/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success("Song Added");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(null);
        setSong(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-[250px] mt-16 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 p-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin" />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Add New Song</h2>
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-fuchsia-200 font-medium mb-4">Upload Song</label>
                  <input
                    onChange={(e) => setSong(e.target.files[0])}
                    type="file"
                    id="song"
                    accept="audio/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="song"
                    className="relative group cursor-pointer flex items-center justify-center w-32 h-32 rounded-xl bg-black/30 border-2 border-dashed border-fuchsia-500/30 hover:border-fuchsia-500/60 transition-colors"
                  >
                    <Music className={`w-8 h-8 ${song ? 'text-fuchsia-500' : 'text-fuchsia-500/60 group-hover:text-fuchsia-500'} transition-colors`} />
                  </label>
                </div>

                <div>
                  <label className="block text-fuchsia-200 font-medium mb-4">Upload Image</label>
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="relative group cursor-pointer flex items-center justify-center w-32 h-32 rounded-xl bg-black/30 border-2 border-dashed border-fuchsia-500/30 hover:border-fuchsia-500/60 transition-colors"
                  >
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-fuchsia-500/60 group-hover:text-fuchsia-500 transition-colors" />
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-fuchsia-200 font-medium mb-2">Song Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-fuchsia-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-colors"
                    placeholder="Enter song name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-fuchsia-200 font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-fuchsia-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-colors"
                    placeholder="Enter song description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-fuchsia-200 font-medium mb-2">Album</label>
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-fuchsia-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-colors"
                  >
                    <option value="none">None</option>
                    {albumData.map((item, index) => (
                      <option key={index} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-medium rounded-lg hover:from-fuchsia-600 hover:to-violet-600 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            >
              Add Song
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddSong;