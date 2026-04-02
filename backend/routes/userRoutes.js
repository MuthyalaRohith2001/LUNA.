import express from 'express';
import User from '../models/User.js';
import jwt from "jsonwebtoken";
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

//@route POST /api/users/register(api/user => server.js)
//@desc Register a new user
//@access Public

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //Registration logic
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new User({ name, email, password })
        await user.save()

        //Create JWT Payload
        const payload = { user: { _id: user._id, role: user.role } }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})


//@route POST /api/users/login
//@desc Authenticate user
//@access Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })

        //Check if user exist
        if (!user) return res.status(400).json({ message: "Invalid Credentials" })
        const isMatch = await user.matchPassword(password)
        //Check if password matches
        if (!isMatch)
            return res.status(400).json({ message: "Invalid Credentials" })

        //Create JWT Payload
        const payload = { user: { _id: user._id, role: user.role } }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
            if (err) throw err;

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//@route GET /api/users/profile
//@desc Get logged-in user's profile (Protected Route)
//@access Private

router.get("/profile", protect, async (req, res) => {
    res.json(req.user)
})

export default router