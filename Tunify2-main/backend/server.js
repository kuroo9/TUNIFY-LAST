import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import albumRouter from './src/routes/albumRoute.js';
import authRouter from './src/routes/authRoute.js'
import playlistRouter from './src/routes/playlistRoute.js';
import passport from "passport";
import User from './src/models/userModel.js';
import likedRouter from './src/routes/likedRoutes.js'

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// Passport JWT Strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || "thisKeyIsSupposedToBeSecret",
        },
        async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.identifier);
                return user ? done(null, user) : done(null, false);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

//initializing routes
app.use('/api/song',songRouter);
app.use('/api/album',albumRouter);
app.use('/api/auth',authRouter);
app.use('/api/playlist',playlistRouter);
app.use('/api/likedSongs',likedRouter);

app.get('/', (req,res)=>res.send("API Working"));

app.listen(port,()=>console.log(`Server started on ${port}`));