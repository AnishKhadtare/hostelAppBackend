import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({  
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    hostel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hostel",
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5,
    },
    comment : {
        type : String,
        required : true,
        maxLength : 500,
    },
    datePosted : {
        type : Date,
        default : Date.now,
    },
}, {timestamps : true});

export const Review = new mongoose.model("Review", reviewSchema);