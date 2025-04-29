import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    album: { type: String, required: true },
    image: { type: String, required: true },
    audio: { type: String, required: true }, // Changed from 'file' to 'audio'
    duration: { type: String, required: true }
});

const songModel = mongoose.models.song || mongoose.model("song", songSchema);

export default songModel;