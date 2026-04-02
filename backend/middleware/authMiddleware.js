import jwt from "jsonwebtoken";
import User from "../models/User.js"
import dotenv from 'dotenv';

dotenv.config()


//Middleware to protect routes(verifying the token and getting user details)
export const protect = async (req, res, next) => {
    let token;
    //We will assign this header with the bearer string at the front end while making the request for the profile
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.user._id).select("-password");//Exclude password
            next()
        } catch (error) {
            console.error("Token verification failed", error)
            res.status(401).json({ message: "Not authorized, token failed" })
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token provided" })
    }
}


//Middleware to check if user is an admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).json({ message: "Not authorized as an admin" })
    }
}





/*
decoded  It is from the payload
{
  "user": {
    "_id": "69836bc76db66a6ca79c7638",
    "role": "customer"
  },
  "iat": 1770220488,
  "exp": 1770364488
}


//note:  req.user = await User.findById(decoded.user._id).select("-password");//Exclude password
{
    "_id": "69836bc76db66a6ca79c7638",
    "name": "Muthyala",
    "email": "Muthyala@gmail.com",
    "role": "customer",
    "createdAt": "2026-02-04T15:54:47.828Z",
    "updatedAt": "2026-02-04T15:54:47.828Z",
    "__v": 0
}
*/





{/**//note middleware to protect routes */ }