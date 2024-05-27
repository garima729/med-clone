// api/controller/auth.js

import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "rawatgarima729@gmail.com", // your Gmail address
    pass: "fgpttnoflenqbsiv", // your Gmail password or App Password
  },
});

// This function is responsible for registering a new user in the database
export const register = (req, res) => {
  // CHECK EXISTING USER
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(query, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const query = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(query, [values], (err, data) => {
      if (err) return res.json(err);
      
      // Send verification email
      const mailOptions = {
        from: '"Blog App" <rawatgarima729@gmail.com>',
        to: req.body.email,
        subject: "Verify your email address",
        text: "Thank you for registering. Please verify your email address by clicking the link below.",
        html: `<b>Thank you for registering. Please verify your email address by clicking the link below.</b><br>
               <a href="http://localhost:8800/api/auth/verify/${data.insertId}">Verify Email</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json("Error sending verification email");
        }
        return res.status(200).json("User has been created. Verification email sent.");
      });
    });
  });
};

// Verification function
export const verifyEmail = (req, res) => {
  const userId = req.params.id;

  const query = "UPDATE users SET verified = 1 WHERE id = ?";
  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Email has been verified.");
  });
};

// This function handles user login
export const login = (req, res) => {
  // SQL query to check if the user exists in the DB
  const query = "SELECT * FROM users WHERE username = ?";

  // Execute the query with the provided username
  db.query(query, [req.body.username], (err, data) => {
    // Handle DB errors
    if (err) return res.json(err);

    // If no user is found, return an error
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    // If the password is incorrect, return an error
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    // If the login is successful, create a JSON web token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    // Remove the password from the user data
    const { password, ...other } = data[0];

    // Set the token as a http-only cookie and send user data as response
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

// This function handles user logout
export const logout = (req, res) => {
  // Clear the access_token cookie and send a success message
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
