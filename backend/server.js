import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import checkRoutes from "./routes/checkoutRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import subscribeRoute from "./routes/subscribeRoute.js"
import adminRoutes from "./routes/adminRoutes.js"
import productAdminRoutes from "./routes/productAdminRoutes.js"
import adminOrderRoutes from "./routes/adminOrderRoutes.js"

const app = express()

//To make server work with json data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//To communicate with the react server
app.use(cors())
//To load environment variables we need to call config()
dotenv.config()
connectDB()

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("Welcome to my website LUNA!")
})

//API Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", subscribeRoute)

//Admin
app.use("/api/admin/users", adminRoutes)
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders", adminOrderRoutes)


//note PORT:Identifies the application on the device
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`)
})

