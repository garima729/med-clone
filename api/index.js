// api/index.js

import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js"; // Import the user routes

import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // Assuming your React app runs on this port
  credentials: true
}));
// Configuration object for setting destination and filename for the uploaded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where the uploaded file should be stored
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    // Set the filename of the uploaded file
    cb(null, Date.now() + file.originalname);
  },
});

// Set up multer middleware with the defined storage configuration
const upload = multer({ storage });

// Set up a POST endpoint for handling file uploads
app.post("/api/upload", upload.single("file"), function (req, res) {
  // Get the uploaded file
  const file = req.file;
  // Send a response with the filename of the uploaded file
  res.status(200).json(file.filename);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
// Start the server and listen on port 8800
app.listen(8800, () => {
  console.log("Connected...");
});
