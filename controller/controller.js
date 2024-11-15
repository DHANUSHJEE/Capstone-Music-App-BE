import User from "../model/userSchema.js"
import Album from "../model/albumSchema.js";
import Artist from "../model/artistSchema.js";
import Song from "../model/songSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Playlist from "../model/playlistSchema.js";
import mongoose from "mongoose";

dotenv.config();

const controller = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = bcrypt.hashSync(password, 12);

            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            //if the password is correct generate a token
            const token = jwt.sign({
                id: user._id,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

            res.status(200).json({ message: "User logged in successfully", token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email, password, confirmpassword } = req.body;

            if (!email || !password || !confirmpassword) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            if (password !== confirmpassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    saveArtist: async (req, res) => {
        try {
            const { name, imageURL } = req.body;
            if (!name || !imageURL) {
                return res.status(400).json({ success: false, msg: "All fields are required" });
            }

            const newArtist = new Artist({ name, imageURL });
            const savedArtist = await newArtist.save();

            return res.status(200).json({ success: true, artist: savedArtist });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    getOneArtist: async (req, res) => {
        try {
            const artist = await Artist.findById(req.params.id);

            if (!artist) {
                return res.status(404).json({ success: false, msg: "Artist not found" });
            }

            return res.status(200).json({ success: true, artist });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    getAllArtist: async (req, res) => {
        try {
            const data = await Artist.find().sort({ createdAt: 1 }); // Sort artists by creation date in ascending order
            if (data) {
                return res.status(200).json({ success: true, data: data });
            } else {
                return res.status(404).json({ success: false, msg: "No artists found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },
    
    deleteArtist: async (req, res) => {
        try {
            const artistId = req.params.id;

            // Find and delete the artist by ID
            const deletedArtist = await Artist.findByIdAndDelete(artistId);

            if (!deletedArtist) {
                return res.status(404).json({ success: false, msg: "Artist not found" });
            }

            return res.status(200).json({ success: true, msg: "Artist deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    editArtist: async (req, res) => {
        try {
            const artistId = req.params.id;
            const { name, imageURL } = req.body;

            // Check if required fields are provided
            if (!name || !imageURL) {
                return res.status(400).json({ success: false, msg: "All fields are required" });
            }

            // Find the artist by ID and update
            const updatedArtist = await Artist.findByIdAndUpdate(
                artistId,
                { name, imageURL },
                { new: true } // Returns the updated document
            );

            // If artist not found
            if (!updatedArtist) {
                return res.status(404).json({ success: false, msg: "Artist not found" });
            }

            res.status(200).json({ success: true, artist: updatedArtist });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    saveAlbum: async (req, res) => {
        try {
            const { name, imageURL } = req.body;
            if (!name || !imageURL) {
                return res.status(400).json({ success: false, msg: "All fields are required" });
            }

            const newAlbum = new Album({ name, imageURL });
            const savedAlbum = await newAlbum.save();

            return res.status(200).json({ success: true, artist: savedAlbum });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    getOneAlbum: async (req, res) => {
        try {
            const album = await Album.findById(req.params.id);

            if (!album) {
                return res.status(404).json({ success: false, msg: "Album not found" });
            }

            return res.status(200).json({ success: true, album: album });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    getAllAlbum: async (req, res) => {
        try {
            const data = await Album.find().sort({ createdAt: 1 }); // Sort artists by creation date in ascending order
            if (data) {
                return res.status(200).json({ success: true, data: data });
            } else {
                return res.status(404).json({ success: false, msg: "No album found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    deleteAlbum: async (req, res) => {
        try {
            const albumId = req.params.id;

            // Find and delete the album by ID
            const deletedAlbum = await Album.findByIdAndDelete(albumId);

            if (!deletedAlbum) {
                return res.status(404).json({ success: false, msg: "Album not found" });
            }

            return res.status(200).json({ success: true, msg: "Album deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    addSongToAlbum: async (req, res) => {
        try {
            const albumId = req.params.id;
            const { songId } = req.body;

            // Check if required fields are provided
            if (!songId) {
                return res.status(400).json({ success: false, msg: "All fields are required" });
            }            

            // Find the album by ID and update
            const updatedAlbum = await Album.findByIdAndUpdate(
                albumId,
                { $push: { songs: songId } },
                { new: true } // Returns the updated document
            );

            // If album not found
            if (!updatedAlbum) {                
                return res.status(404).json({ success: false, msg: "Album not found" });
            }

            res.status(200).json({ success: true, artist: updatedAlbum })
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: "Server error" });
        }
    },

    editAlbum: async (req, res) => {
        try {
            const albumId = req.params.id;
            const { name, imageURL } = req.body;

            // Check if required fields are provided
            if (!name || !imageURL) {
                return res.status(400).json({ success: false, msg: "All fields are required" });
            }

            // Find the Album by ID and update
            const updatedAlbum = await Album.findByIdAndUpdate(
                albumId,
                { name, imageURL },
                { new: true } // Returns the updated document
            );

            // If Album not found
            if (!updatedAlbum) {
                return res.status(404).json({ success: false, msg: "Album not found" });
            }

            res.status(200).json({ success: true, artist: updatedAlbum });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: "Server error" });
        }

    },
    

    // Save a new song
    saveSong: async (req, res) => {
        try {
            const { name, imageURL, songURL, artist, album, language, genre } = req.body;

            const newSong = new Song({
                name,
                imageURL,
                songURL,
                artist,
                album,
                language,
                genre,
            });

            await newSong.save();
            res.status(200).json({ message: "Song saved successfully", song: newSong });
        } catch (error) {
            res.status(500).json({ message: "Error saving song", error: error.message });
        }
    },
    


    // Get a song by ID
    getSongById: async (req, res) => {
        try {
            const songId = req.params.id;
            const song = await Song.findById(songId);

            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }

            res.status(200).json(song);
        } catch (error) {
            res.status(500).json({ message: "Error fetching song", error: error.message });
        }
    },

    // Get all songs
    getAllSongs: async (req, res) => {
        try {
            const songs = await Song.find();
            res.status(200).json(songs);
        } catch (error) {
            res.status(500).json({ message: "Error fetching songs", error: error.message });
        }
    },

    // Update a song by ID
    updateSongById: async (req, res) => {
        try {
            const songId = req.params.id;
            const { name, imageURL, songURL, album, artist, language, genre } = req.body;

            const updatedSong = await Song.findByIdAndUpdate(
                songId,
                { name, imageURL, songURL, album, artist, language, genre },
                { new: true } // Return the updated document
            );

            if (!updatedSong) {
                return res.status(404).json({ message: "Song not found" });
            }

            res.status(200).json({ message: "Song updated successfully", song: updatedSong });
        } catch (error) {
            res.status(500).json({ message: "Error updating song", error: error.message });
        }
    },

    // Delete a song by ID
    deleteSongById: async (req, res) => {
        try {
            const songId = req.params.id;
            const deletedSong = await Song.findByIdAndDelete(songId);

            if (!deletedSong) {
                return res.status(404).json({ message: "Song not found" });
            }

            res.status(200).json({ message: "Song deleted successfully", song: deletedSong });
        } catch (error) {
            res.status(500).json({ message: "Error deleting song", error: error.message });
        }
    },

    // Download Song
    // downloadSong: async (req, res) => {
    //     try {
    //         const songId = req.params.id;
    //         const song = await Song.findById(songId);

    //         if (!song) {
    //             return res.status(404).json({ message: "Song not found" });
    //         }

    //         const songFilePath = path.join(__dirname, 'songs', song.songURL);
    //         res.download(songFilePath, song.name + '.mp3');
    //     } catch (error) {
    //         res.status(500).json({ message: "Error downloading song", error: error.message });
    //     }
    // },

    // Like Song
    addLike: async (req, res) => {
        try {
            const { id } = req.params; // Song ID
            const { userId } = req.body; // User ID from request body

            // Validate the userId format
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid userId format" });
            }

            // Find the song by ID
            const song = await Song.findById(id);
            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }

            // Ensure the likes array is initialized
            if (!song.likes) {
                song.likes = [];
            }

            // Check if the user has already liked the song
            const userIndex = song.likes.indexOf(userId); // Search for the user in the likes array

            if (userIndex !== -1) {
                // If the user has already liked the song, remove the like
                song.likes.splice(userIndex, 1); // Remove the user from the likes array
                await song.save();  // Save the updated song
                return res.status(200).json({ message: "User unliked the song", likes: false });
            } else {
                // If the user has not liked the song, add the like
                song.likes.push(userId);  // Add the user to the likes array
                await song.save();  // Save the updated song
                return res.status(200).json({ message: "User liked the song", likes: true });
            }
        } catch (error) {
            res.status(500).json({ message: "Error toggling like", error: error.message });
        }
    }
,


//add comment to the song
    addComment: async (req, res) => {
        try {
            const { id } = req.params; // Song ID
            const { userId, text } = req.body; // User ID and comment text from request body

            // Validate the userId format
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid userId format" });
            }

            // Convert userId to ObjectId
            const userObjectId = new mongoose.Types.ObjectId(userId);

            // Find the song
            const song = await Song.findById(id);
            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }

            // Add the comment
            song.comments.push({ userId: userObjectId, text });
            await song.save();

            res.status(200).json({ message: "Comment added successfully", song });
        } catch (error) {
            res.status(500).json({ message: "Error adding comment", error: error.message });
        }
    },

    
    // Create a new playlist
    createPlaylist: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.params.userId; // Get userId from params

            // Find the user by userId to associate the playlist with the user
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Create a new playlist and associate it with the user
            const newPlaylist = new Playlist({
                name,
                userId,
                songs: [],
            });

            await newPlaylist.save();

            // Initialize playlists array if it doesn't exist
            if (!user.playlists) {
                user.playlists = [];
            }

            // Add the playlist to the user's playlists
            user.playlists.push(newPlaylist._id);
            await user.save();

            res.status(200).json({ message: "Playlist created successfully", playlist: newPlaylist });
        } catch (error) {
            res.status(500).json({ message: "Error creating playlist", error: error.message });
        }
    },



    // Get all playlists for a user
    getUserPlaylists: async (req, res) => {
        try {
            const { userId } = req.params;
            const playlists = await Playlist.find({ userId }).populate("songs");

            res.status(200).json({ playlists });
        } catch (error) {
            res.status(500).json({ message: "Error fetching playlists", error: error.message });
        }
    },

    // Add a song to a playlist
    addSongToPlaylist: async (req, res) => {
        try {
            const { playlistId } = req.params;
            const { songId } = req.body;

            // Find the playlist
            const playlist = await Playlist.findById(playlistId);
            if (!playlist) {
                return res.status(404).json({ message: "Playlist not found" });
            }

            // Find the song
            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ message: "Song not found" });
            }

            // Avoid duplicate songs
            if (!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                await playlist.save();
                res.status(200).json({ message: "Song added to playlist", playlist });
            } else {
                res.status(400).json({ message: "Song already exists in the playlist" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error adding song to playlist", error: error.message });
        }
    },



    // Remove a song from a playlist
    removeSongFromPlaylist: async (req, res) => {
        try {
            const { playlistId } = req.params;
            const { songId } = req.body;

            // Find the playlist
            const playlist = await Playlist.findById(playlistId);
            if (!playlist) {
                return res.status(404).json({ message: "Playlist not found" });
            }

            // Check if song is in playlist
            const songIndex = playlist.songs.indexOf(songId);
            if (songIndex === -1) {
                return res.status(404).json({ message: "Song not found in playlist" });
            }

            // Remove the song
            playlist.songs.splice(songIndex, 1);
            await playlist.save();
            res.status(200).json({ message: "Song removed from playlist", playlist });
        } catch (error) {
            res.status(500).json({ message: "Error removing song from playlist", error: error.message });
        }
    },
    //getAllSongInPlaylist
    getSongsInPlaylist: async (req, res) => {
        try {
            const { playlistId } = req.params;

            // Find the playlist by ID and populate the songs within the playlist
            const playlist = await Playlist.findById(playlistId).populate("songs");

            if (!playlist) {
                return res.status(404).json({ success: false, msg: "Playlist not found" });
            }

            // Send the songs from the playlist
            return res.status(200).json({ success: true, songs: playlist.songs });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Server error" });
        }
    },



    // Delete a playlist
    deletePlaylist: async (req, res) => {
        try {
            const { id } = req.params;

            const playlist = await Playlist.findById(id);
            if (!playlist) {
                return res.status(404).json({ message: "Playlist not found" });
            }

            await Playlist.findByIdAndDelete(id);
            res.status(200).json({ message: "Playlist deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting playlist", error: error.message });
        }
    }




}

export default controller;
