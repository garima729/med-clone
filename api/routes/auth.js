// api/routes/auth.js

import express from "express";
import { login, logout, register, verifyEmail } from "../controller/auth.js";

// creating a new router instance
const router = express.Router();

// defining routes for register, login, and logout
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:id", verifyEmail);

// exporting the router instance
export default router;
