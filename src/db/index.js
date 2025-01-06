import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Mongo Db Connected !! DB HOST : ", connectionInstance.connection.host);    
    }
    catch (error) {
        console.log("MongoDB Connection Error : ", error);
    }
}

export default connectDb;