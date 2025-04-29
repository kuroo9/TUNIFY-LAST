import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        };

        const album = new albumModel(albumData);
        await album.save();

        res.json({ success: true, message: "Album added" });
    } catch (error) {
        console.error("Error adding album:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({});
        res.json({ success: true, albums: allAlbums });
    } catch (error) {
        console.error("Error listing albums:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const removeAlbum = async (req, res) => {
    try {
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album removed" });
    } catch (error) {
        console.error("Error removing album:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addAlbum, listAlbum, removeAlbum };