// api/controller/users.js
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const getUserDetails = (req, res) => {
  const userId = req.params.id;

  const q = "SELECT `username`, `email`, `profile_img` FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const updateUserDetails = (req, res) => {
  const token = req.cookies.access_token;

  console.log("Received Token:", token);

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = req.params.id;

    if (userInfo.id !== parseInt(userId, 10)) {
      return res.status(403).json("You can only update your profile");
    }

    const { username, email } = req.body;
    const profile_img = req.file ? `/upload/${req.file.filename}` : req.body.profile_img;

    const q = "UPDATE users SET `username`=?, `email`=?, `profile_img`=? WHERE `id` = ?";
    const values = [username, email, profile_img];

    db.query(q, [...values, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status200.json("User details updated successfully.");
    });
  });
};
