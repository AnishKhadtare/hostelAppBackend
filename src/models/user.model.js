import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
    },
    isBuyer:{
        type : Boolean,
        required : true,
    },
    isSeller:{
        type : Boolean,
        required : true,
    },
    phone : {
        type : String,
        required : true,
    }
},{timestamps : true})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            userName: this.userName,
            email: this.email,
            isBuyer: this.isBuyer,
            isSeller: this.isSeller,
            phone: this.phone,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {   
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    )
}

export const User = new mongoose.model("User", userSchema);