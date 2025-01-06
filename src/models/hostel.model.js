import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema({  
    name : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    rent : {
        type : Number,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    photos : [{
        type : String,
        required : true,
    }],
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    status : {
        type : String,
        enum : ["Available", "Unavailable"],
    },
    latitude : {
        type : Number,
    },
    longitude : {
        type : Number,
    },
}, {timestamps : true});

export const Hostel = new mongoose.model("Hostel", hostelSchema);