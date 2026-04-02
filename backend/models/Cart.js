import mongoose from "mongoose"



const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: {
        type: Number,
        required: true
    },
    size: String,
    color: String,
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
},
    { _id: false }
)
/*This schema represents a single product inside the cart, not the whole cart. */

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    guestId: {
        type: String,
        index: true
    },
    products: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
)
//note:This represents the entire cart, not a single product.
const Cart = mongoose.model("Cart", cartSchema)

export default Cart