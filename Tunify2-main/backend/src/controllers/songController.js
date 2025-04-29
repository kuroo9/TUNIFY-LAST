import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const imageFile = req.files.image[0];
        const audioFile = req.files.audio[0];

        if (!imageFile || !audioFile) {
            return res.status(400).json({ success: false, message: "Image and audio are required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            audio: audioUpload.secure_url,
            duration
        };

        const song = new songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song added" });
    } catch (error) {
        console.error("Error adding song:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error("Error listing songs:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song removed" });
    } catch (error) {
        console.error("Error removing song:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addSong, listSong, removeSong };