import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findOne(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    }
    
    catch (error) {
        throw new Error(`Access and Refresh Token Generation Failed During Login. ERROR : ${error.message}`);
    }
}

const registerUser = async (req, res) => {
    try {
        const { userName, email, password, isBuyer, isSeller, phone } = req.body;
        console.log('Received data:', req.body);

        // Check if any string field is empty
        if ([userName, email, password, phone].some(field => typeof field !== 'string' || field.trim() === "")) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Trim the string fields
        const trimmedUserName = userName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedPhone = phone.trim();

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        const newUser = await User.create({
            userName: trimmedUserName,
            email: trimmedEmail,
            password: hashedPassword,
            isBuyer,
            isSeller,
            phone: trimmedPhone
        });

        return res.status(201).json({ message: "User created successfully.", newUser });
    } catch (error) {
            console.error('User Registration Error:', error.message);
            return res.status(500).json({ message: `User Registration Error : ${error.message}` });
    }
};

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if([email, password].some((data) => data.trim() === "")){
            return res.status(400).json({message: "All fields are required."});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User does not exists."});
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        console.log({ isPasswordCorrect, enteredPassword: password, storedPassword: user.password });
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Incorrect Password"});
        }
        
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure : true,
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message : "User Login Completed Successfully",
            loggedInUser,
        })
    }
    catch(error){
        return res.status(400).json({
            message : `User Login Unsuccessful : ERROR : ${error.message}`,
        });
    }
}

const logoutUser = async (req, res) => {
    try{
        await User.findByIdAndUpdate(req.user._id,
            {
                $set : {
                    refreshToken : undefined,
                }, 
            },
        {new : true});

        return res.status(200).json({
            message : "User Logout Successfully",
        })
    }
    catch(error){
        return res.status(400).json({
            message : `User Logout Unsuccessful : ERROR : ${error.message}`
        });
    }
}

const changeCurrentPassword = async(req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;
        if([oldPassword, newPassword].some((data) => data.trim() === "")){
            return res.status(400).json({
                message : "Please Enter All Fields",
                });
        }
        const user = await User.findById(req.user._id);

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message : "Old Password is Incorrect",    
            });
        }

        user.password = newPassword;
        await user.save({validateBeforeSave: false});

        return res.status(200).json({
            message : "Password Changed Successfully",
        });
    }
    catch(error){
        return res.status(400).json({
            message : `User Change Current Password Unsuccessful : ERROR : ${error.message}`
        });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ message: `User Get Current User Unsuccessful : ERROR: ${error.message}`});
    }
}


export {registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser};