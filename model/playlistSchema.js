import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who owns the playlist
        required: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song' // References the Song model
        }
    ]
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;
