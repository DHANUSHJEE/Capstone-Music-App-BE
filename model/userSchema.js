import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]  // This should be an array of Playlist IDs
});

const User = mongoose.model('User', userSchema);
export default User;
