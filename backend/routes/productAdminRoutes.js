import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/products
//@desc Get all products (Admin)
//@access Private/Admin
//You get just the data (lightweight)
//note:Without .lean() ,You get a full machine with tools
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).lean();
        res.json(products);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: error.message });
    }
});

//@route POST /api/admin/products
//@desc Create new product
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            user: req.user._id // ✅ important
        });

        const createdProduct = await product.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: error.message });
    }
});

//@route PUT /api/admin/products/:id
//@desc Update product
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //  Basic fields
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.countInStock = req.body.countInStock || product.countInStock;
        product.sku = req.body.sku || product.sku;
        product.images = req.body.images || product.images;
        product.category = req.body.category || product.category;
        product.brand = req.body.brand || product.brand;

        // Correct way for arrays
        if (req.body.sizes !== undefined) {
            product.sizes = req.body.sizes;
        }

        if (req.body.colors !== undefined) {
            product.colors = req.body.colors;
        }

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: error.message });
    }
});
/*
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.countInStock = req.body.countInStock || product.countInStock;

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: error.message });
    }
});*/

//@route   DELETE /api/admin/products/:id
//@desc    Delete product
//@access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();

        res.json({ message: "Product removed" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;