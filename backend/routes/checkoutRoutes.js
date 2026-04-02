import express from "express"
import Checkout from "../models/Checkout.js"
import Cart from "../models/Cart.js"
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from './../middleware/authMiddleware.js';

const router = express.Router()
//@route POST /api/checkout
//@desc Create a new checkout session
//@access Private
//Create a new checkout session
router.post("/", protect, async (req, res) => {

    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no items in checkout" })
    }
    try {
        //Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,//From token verification
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false
        })
        res.status(201).json(newCheckout)
    } catch (error) {
        console.error("Error Creating checkout session:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

//@route PUT/api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body


    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }
        if (paymentStatus === "paid") {
            checkout.isPaid = true
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save()
            res.status(200).json(checkout)
        } else {
            res.status(400).json({ message: "Invalid Payment Status" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment confirmation
//@access Private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }
        // 🔐 Security: ensure checkout belongs to logged-in user
        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }
        if (checkout.isPaid && !checkout.isFinalized) {
            //Create final order based on the checkout details
            //orderItems will store an array of products
            const orderItems = checkout.checkoutItems.map(item => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            }))
            //Creating an order
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "Paid",
                paymentDetails: checkout.paymentDetails
            })
            //Mark the checkout as finalized
            checkout.isFinalized = true
            checkout.finalizedAt = Date.now()
            await checkout.save()
            //Once the order is finalized delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" })
        } else {
            res.status(400).json({ message: "Checkout is not paid" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router