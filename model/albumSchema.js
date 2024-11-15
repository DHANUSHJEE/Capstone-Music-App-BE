import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Adding timestamps to track creation and update times

// Exporting the model
const Album = mongoose.model('Album', albumSchema);
export default Album;
