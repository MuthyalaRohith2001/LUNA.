import mongoose from "mongoose";
import dotenv from 'dotenv';
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import products from "./data/products.js";

dotenv.config()

//Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)

//Function to seed data

const seedData = async () => {
    try {
        //Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany()
        /*Yes — this will return a document */
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "12345678",
            role: "admin"
        })

        //Assign the default user Id to each product
        const userID = createdUser._id
        const sampleProduct = products.map((product) => {
            return { ...product, user: userID }
        })

        //Insert the products into the database
        await Product.insertMany(sampleProduct)
        console.log("Product data seeded successfully!")
        process.exit()
    } catch (error) {
        consolr.log("Error Seeding the data", error)
        process.exit(1)
    }
}
seedData();

/**
JavaScript array methods change data in
memory — only Mongoose queries change the database.
 */