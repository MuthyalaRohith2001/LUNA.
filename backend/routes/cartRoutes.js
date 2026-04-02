import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router()


//Helper function to get a cart by user Id or guest ID
//note:Cart belongs to a user, so we query by the owner’s ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null
}

//@route POST /api/cart
//@desc Add a product to the cart for a (guest or logged in user)
//@access public
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body
    try {
        //checking if the product is in the database
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        //Determine if the user is logged in or guest
        //note:Getting the data from the cartSchema based on userId or guestId (Cart.js)  (2) getting the added products
        let cart = await getCart(userId, guestId)

        //If the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId &&
                p.size === size && p.color === color)
            if (productIndex > -1) {
                //If the product already exists, update the quantity
                cart.products[productIndex].quantity += Number(quantity)

            } else {
                //add new product ot an array(products)
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity
                })
            }
            //Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity,
                0)
            await cart.save()
            return res.status(200).json(cart)
        } else {
            //note:Create a new cart for the guest or user(creates a cart and adds one product) (1)
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: userId ? undefined : (guestId || "guest_" + new Date().getTime()),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0]?.url || "",
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity
            })
            return res.status(201).json(newCart)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

//@route PUT /api/cart
//@desc Update product quantity in the cart for a guest or logged-in user
//@access Public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        //note:So we would get the created products from the cartSchema(Cart.js)
        let cart = await getCart(userId, guestId)
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }
        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size && p.color === color)

        if (productIndex > -1) {
            //update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                // remove product from cart
                //Remove product if quantity is 0
                cart.products.splice(productIndex, 1)
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

//@route DELETE/api/cart
//desc Remove a product from the cart
//@accesss Public
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "cart not found" })

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color)

        if (productIndex > -1) {
            //deleting the product
            cart.products.splice(productIndex, 1)
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save();
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server Error" })
    }
})

//@route GET /api/cart
//@desc Get logged-in user's or guest user's cart (Displaying the cart)
//@access Public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query

    try {
        const cart = await getCart(userId, guestId)
        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ message: "Cart not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})


//@route POST /api/cart/merge
//@desc Merge guest cart into user cart on login
//@access Private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
    try {
        //Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId })
        //This line is only for logged-in users in Cart.
        const userCart = await Cart.findOne({ user: req.user._id })

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest cart is empty" })
            }
            if (userCart) {
                //If there is a existing user cart
                //Merge guest cart into user cart (If the cart exist and adding the same product to the user cart)
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString()
                        && item.size === guestItem.size
                        && item.color === guestItem.color);

                    if (productIndex > -1) {
                        //If the items exists in the user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity
                    } else {
                        //Otherwise, add the guest item to the cart(If the cart is exist and but adding other product to the cart)
                        userCart.products.push(guestItem)
                    }
                })
                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
                await userCart.save()
                //Remove the guest cart after merging(means deleting the document from the colletion Cart)
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.error("Error deleting guest cart:", error);
                }
                res.status(200).json(userCart)
            }
            else {
                //If the user has no existing cart,assign the guest cart to the user
                //note:Yes — even if user was not stored earlier, assigning guestCart.user = req.user._id and saving will store it in DB because the schema allows that field.
                guestCart.user = req.user._id
                guestCart.guestId = undefined
                await guestCart.save()
                res.status(200).json(guestCart)
            }
        } else {
            if (userCart) {
                //Guest cart has already been merged, return user cart
                return res.status(200).json(userCart)
            }
            res.status(404).json({ message: "Guest cart not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router 