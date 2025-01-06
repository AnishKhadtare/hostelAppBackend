import { User } from "../models/user.model.js";

const isSellerAuth = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id);
        if(user.isSeller){
            next();
        }
        else{
            return res.status(403).json({message: "You do not have access to this route."});
        }
    }
    catch(error){
        return res.status(500).json({message: `User seller authentication error. ${error.message}`});
    }
}

export {isSellerAuth};