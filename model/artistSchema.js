import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    imageURL: {
        type: String,
        required: true
    }
},{timestamps:true})

// Create and export the model based on the schema
const Artist = mongoose.model("Artist", artistSchema);

export default Artist