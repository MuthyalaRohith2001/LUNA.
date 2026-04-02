import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connection  successful")
    } catch (error) {
        console.log("MongoDB connection failed:", error.message)
         process.exit(1); // stop app if DB fails
    }
}

export default connectDB