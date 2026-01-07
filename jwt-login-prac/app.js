import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/auth.js";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/user");
    console.log("Connected to mongoose");
  } catch (err) {
    console.log("Unable to connect to mongoose");
    process.exit(1);
  }
}
connectDB();
let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});
let User = mongoose.model("User", userSchema);
dotenv.config();

let port = process.env.port || 3000;
let JWT_SECRET = process.env.JWT_SECRET;
let app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.get("/login", (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/dashboard", authenticateToken, async (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  let user_id = req.user.id;
  let user = await User.findOne({ _id: user_id });
  if (user)
    return res.sendFile(path.join(__dirname, "views", "dashboard.html"));
  else return res.redirect("/login");
});

async function hashPassword(password) {
  let saltRounds = 10;
  let hashedPass = await bcrypt.hash(password, saltRounds);
  return hashedPass;
}
app.post("/signup", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  if (!username || !password || !confirmPassword) {
    return res.status(400).send("All fields are required.");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }
  if (password.length < 5) {
    return res.status(400).send("Password must be at least 5 characters long.");
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).send("Username already Taken");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }

  let hashedPass = await hashPassword(password);
  let newUser = new User({
    username: username,
    password: hashedPass,
  });
  await newUser.save();

  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
  });

  return res.status(200).send("User Created");
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).send("Logged out");
});

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).send("All fields are required.");
  }
  if (password.length < 5) {
    return res.status(400).send("Password must be at least 5 characters long.");
  }
  try {
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("User not found");
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Wrong Password");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "5m" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "strict",
    });

    res.status(200).send("Login successfull");
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
