import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';
import playlistModel from '../models/playlistModel.js';
import passport from "passport";

const addPlaylist = async (req, res) => {
    try {
        const { name, desc } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const playlistData = {
            name,
            desc,
            image: imageUpload.secure_url
        };

        const playlist = new playlistModel(playlistData);
        await playlist.save();

        res.json({ success: true, message: "Album added" });
    } catch (error) {
        console.error("Error adding album:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export {addPlaylist};