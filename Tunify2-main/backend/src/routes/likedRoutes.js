import express from "express";
import passport from "passport";
import User from "../models/userModel.js";
import songModel from "../models/songModel.js";

const likedRouter = express.Router();

// Toggle Like/Unlike a Song
likedRouter.post(
    "/like-unlike",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            console.log("Received request:", req.body); // Debugging
            const userId=req.user;
            const {songId} = req.body;
            if (!songId || !userId) {
                return res.status(400).json({ success: false, message: "Missing songId or userId" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const songIndex = user.likedSongs.indexOf(songId);
            if (songIndex > -1) {
                user.likedSongs.splice(songIndex, 1); // Unlike
            } else {
                user.likedSongs.push(songId); // Like
            }

            await user.save();
            res.json({ success: true, liked: songIndex === -1 });
        } catch (error) {
            console.error("Error in /toggle:", error);
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
);

// Get User's Liked Songs
likedRouter.get(
    "/liked",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const userId = req.user._id;
            if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

            const user = await User.findById(userId).populate("likedSongs");
            if (!user) return res.status(404).json({ success: false, message: "User not found" });

            res.status(200).json({ success: true, likedSongs: user.likedSongs });
        } catch (error) {
            console.error("Error in /get:", error);
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
        //return res.status(200).json({data: user});
        
    }
);

export default likedRouter;
