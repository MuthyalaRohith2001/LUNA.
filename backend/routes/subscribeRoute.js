import express from "express"
import Subscriber from "../models/Subscribe.js"
const router = express.Router()


//@route POST /api/subscribe
//@desc Handle newsletter subscription
//@access Public
router.post("/subscribe", async (req, res) => {
    const { email } = req.body

    if (!email) {
        return req.status(400).json({ message: "Email is required" })
    }
    try {
        //Check if the email is already subscribed
        let subscriber = await Subscriber.findOne({ email })
        if (subscriber) {
            return res.status(400).json({ message: "Email is already subscribed" })
        }
        //Create a mew subscriber
        subscriber = new Subscriber({ email })
        await subscriber.save()

        res.status(201).json({ message: "Successfully subscribed to the newsletter!" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router