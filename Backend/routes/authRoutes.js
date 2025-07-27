const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Secret Key for JWT (Stored in .env file)
const SECRET_KEY = process.env.JWT_SECRET;
require("dotenv").config({ path: "../.env" });
console.log("JWT_SECRET in authRoutes:", process.env.JWT_SECRET);

// User Registration
router.post("/register", async (req, res) => {
    try {
        console.log("📩 Incoming Request Body:", req.body);
        const { _id, name, phone, area, password, status } = req.body;

        if (!_id || !name || !phone || !area || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ _id }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User ID or phone number already registered" });
        }

        // ✅ Validate status or default to Active
        const validStatus = ["Active", "Inactive"].includes(status) ? status : "Active";
        console.log("✅ Final User Status:", validStatus);

        // ✅ Create and save user (password will be hashed by schema)
        const user = new User({
            _id,
            name,
            phone,
            area,
            password, // raw password - will be hashed by schema
            subscription_plans: "",
            payment_status: "",
            status: validStatus,
            role: "Customer"
        });

        await user.save();
        console.log("🧠 Saved User (from DB):", user);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                area: user.area,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error("🚨 Registration Error:", error.message);
        res.status(500).json({ error: "Server error during registration" });
    }
});



// User Login
router.post("/login", async (req, res) => {
    try {
        const { _id, phone, password } = req.body;

        // Fetch user from DB
        const user = await User.findOne({ $or: [{ _id }, { phone }] });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        console.log("🔍 User fetched from DB:", user);

        // Compare entered password with the hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("🔑 Entered Password:", password);
        console.log("🗄️ Hashed Password from DB:", user.password);
        console.log("✅ Password Match Result:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // If role is "Admin", set status to "Active"
        if (user.role === "Admin" && user.status !== "Active") {
            user.status = "Active";
            await user.save();
            console.log("✅ Admin status set to Active");
        }

        // Create tokens if login is successful
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        console.log("Generated Access Token:", accessToken);
        console.log("Generated Refresh Token:", refreshToken);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                area: user.area,
                subscription: user.subscription_plans,
                status: user.status
            }
        });
    } catch (error) {
        console.error("🚨 Login Error:", error.message);
        res.status(500).json({ error: "Server error during login" });
    }
});


module.exports = router;
