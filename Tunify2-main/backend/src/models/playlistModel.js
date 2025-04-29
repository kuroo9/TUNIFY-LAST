import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String , required :true},
    image: { type: String, required: true },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Song",
        },
    ],

     // Changed from 'file' to 'audio'
});

const playlistModel = mongoose.models.playlist || mongoose.model("playlist", playlistSchema);

export default playlistModel;