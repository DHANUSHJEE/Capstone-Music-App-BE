import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Ensure this is ObjectId
    required: true,
    ref: 'User'
  },
  text: {  // Ensure the field is named "text"
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  songURL: {
    type: String,
    required: true
  },
  album: {
    type: String
  },
  artist: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  genre: {
    type: String
  },
  comments: [commentSchema]  // Embed comments schema
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
export default Song;
