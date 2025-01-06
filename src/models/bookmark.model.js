import mongoose from "mongoose";

const bookmarkHostelSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    hostel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hostel",
    }
});

export const Bookmark = mongoose.model("Bookmark", bookmarkHostelSchema);