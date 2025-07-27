const express = require('express');
const Plan = require('../models/Plan');
const router = express.Router();

// Import the correct middleware functions
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Create a new plan (Admin only)
router.post("/plans", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { _id, name, features, payment_terms, price } = req.body;

        // Validate required fields
        if (!_id || !name || !features || !payment_terms || price == null) {
            return res.status(400).json({
                message: "All fields (ID, name, features, payment terms, price) are required"
            });
        }

        // Check for existing plan
        const existingPlan = await Plan.findById(_id);
        if (existingPlan) {
            return res.status(400).json({
                message: "Plan with this ID already exists"
            });
        }

        // Create new plan
        const newPlan = new Plan({
            _id,
            name,
            features,
            payment_terms,
            price
        });

        await newPlan.save();

        res.status(201).json({
            message: "Plan created successfully",
            plan: newPlan
        });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({
            message: "Server error, unable to create plan",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete a plan (Admin only)
router.delete("/plans/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({
                error: "Plan not found"
            });
        }

        res.json({
            message: "Plan deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all plans (Public access)
router.get('/plans', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;