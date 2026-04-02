import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ ROUTE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 🔥 Debug (VERY IMPORTANT)
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Convert buffer → stream → Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" }, // ✅ optional but good practice
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // ✅ Upload
    const result = await streamUpload(req.file.buffer);

    console.log("UPLOAD RESULT:", result);

    // ✅ Response
    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message, // ✅ helps debugging
    });
  }
});

export default router;
/*import express from "express"
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import streamifier from "streamifier"
import dotenv from "dotenv"



dotenv.config()

const router = express.Router()

//Cloudinary Configuration
//Note:This connects your backend to your Cloudinary account.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Multer setup using memory storage
//File will be stored in RAM as a buffer
//That buffer will be available in:req.file.buffer
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded" })
        }
        //Function to handle the stream upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                //note:This creates a writable stream to Cloudinary.
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                })
                //Use streamifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }
        //Call the streamUpload function
        const result = await streamUpload(req.file.buffer)
        //Respond with the uploaded image URL
        res.json({ imageUrl: result.secure_url })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Sever Error" })
    }
})

export default router*/