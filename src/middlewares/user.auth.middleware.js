import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
    try {   
        const token = req.cookies?.accessToken;

        if(!token){
            return res.status(400).json({
                message : "Unauthorised Request! Token not found",
            })
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            return res.status(400).json({
                message : "Invalid decoded token",
            })
        }

        req.user = user;
        
        next();
    }
    catch (error){
        return res.status(400).json({
            message : `Invalid user. Authentication Failed ! ERROR : ${error.message}`,
        })
    }
}

export {verifyUser};