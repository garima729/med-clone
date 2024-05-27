

// api/routes/users.js
import express from "express";
import { getUserDetails, updateUserDetails, upload } from "../controller/users.js";

const router = express.Router();

// Route to get user details
router.get("/:id", getUserDetails);

// Route to update user details with file upload handling
router.put("/:id", upload.single("profile_img"), updateUserDetails);

export default router;







