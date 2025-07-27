const express = require('express');
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware"); // Correct import
const User = require('../models/User');
const bcrypt = require("bcryptjs");

const router = express.Router();

// Get all users (Admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Admin" } })  // Exclude Admins
            .select("-password");  // Hide password field
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


// Create a user (Public - for sign-up)
router.post('/users', async (req, res) => {
    try {
        const { _id, name, area, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findById(_id);
        if (existingUser) {
            return res.status(400).json({ message: "User with this ID already exists" });
        }

        // Create new user (Default values for role & status)
        const newUser = new User({
            _id,
            name,
            area,
            password, // Will be hashed in User model before saving
            role: "Customer",  // Default role for new signups
            status: "Active",  // Default status for new users
            subscription_plans: null, // No plan initially
            payment_status: "Pending" // No payments initially
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a user (Admin only - to assign roles)
router.post('/users/admin', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { _id, name, area, subscription_plans, payment_status, status, role, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findById(_id);
        if (existingUser) {
            return res.status(400).json({ message: "User with this ID already exists" });
        }

        // Create new user (Admins can assign roles)
        const newUser = new User({
            _id,
            name,
            area,
            subscription_plans,
            payment_status,
            status,
            role,
            password
        });

        await newUser.save();
        res.status(201).json({ message: "Admin-created user added successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Get all inactive users (Admin only)
router.get('/users/inactive', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const inactiveUsers = await User.find({ status: "Inactive", role: { $ne: "Admin" } }).lean();

        const usersWithPlan = inactiveUsers.map(user => ({
            ...user,
            user_id: user._id,
            user_name: user.name,
            plan_name: user.subscription_plans, // 👈 include the plan string
        }));

        res.json(usersWithPlan);
    } catch (error) {
        res.status(500).json({ error: "Error fetching inactive users" });
    }
});


// Get all active users (Admin only)
router.get("/users/active", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const activeUsers = await User.find({ status: "Active", role: { $ne: "Admin" }, }).lean();

        const usersWithPlan = activeUsers.map(user => ({
            ...user,
            user_id: user._id,
            user_name: user.name,
            plan_name: user.subscription_plans,  // 👈 map the plan field
        }));
        console.log("Filtered active users (excluding Admins):", usersWithPlan);

        res.json(usersWithPlan);
    } catch (error) {
        res.status(500).json({ error: "Error fetching active users" });
    }
});


router.put("/users/:id/status", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        // Validate the status value
        if (!["Active", "Inactive"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: `User status updated to ${status}`, updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


// routes/users.js

// Get unique districts from users
router.get("/area/:area", async (req, res) => {
    try {
        const { area } = req.params;
        const users = await User.find({ area, role: "Customer" });

        if (users.length === 0) {
            return res.status(404).json({ message: "No customers found in this area" });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/users/areas", async (req, res) => {
    try {
        const areas = await User.distinct("area");
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/users/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // don't send password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/users/:id
router.put("/users/:id", verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                area: req.body.area,
            },
            { new: true } // important: returns the updated document
        );
        res.json(updatedUser);
    } catch (err) {
        console.error("Failed to update user:", err);
        res.status(500).json({ error: "Update failed" });
    }
});


router.put("/users/change-password/:id", verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

        user.password = newPassword; // just assign plain text
        await user.save(); // pre-save hook will hash it

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Password change error:", err);
        res.status(500).json({ message: "Server error" });
    }
});




module.exports = router;

