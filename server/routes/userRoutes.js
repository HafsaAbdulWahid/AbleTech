const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const multer = require("multer");
const UserBasicDetails = require("../models/UserBasicDetails");
const UserEducationDetails = require("../models/UserEducationDetails");

// Set up memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle user basic details
router.post("/submit-details", upload.single("resume"), async (req, res) => {
    const { name, age, gender, role, email, linkedin } = req.body;

    if (!name || !age || !gender || !role || !email) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    try {
        const userBasicDetails = new UserBasicDetails({
            name,
            age,
            gender,
            role,
            email,
            linkedin,
            resume: req.file
                ? {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    data: req.file.buffer,
                }
                : undefined,
        });

        await userBasicDetails.save();
        res.status(201).json({ message: "User details saved successfully!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to handle user education details
router.post("/education-details", async (req, res) => {
    try {
        console.log("Received education details:", req.body); // <--- Add this
        const education = new UserEducationDetails(req.body);
        await education.save();
        res.status(201).json({ message: "Education details saved successfully." });
    } catch (error) {
        console.error("Error saving education details:", error);
        res.status(500).json({ message: "Failed to save education details." });
    }
});


// REGISTER
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!", user: { name } });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful!",
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route to create jobs
router.post("/jobs", async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json({ message: "Job created!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Job creation failed." });
    }
});



// Route to fetch jobs from db
router.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs." });
    }
});


module.exports = router;
