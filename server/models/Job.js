const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    time: String,
    title: String,
    company: String,
    type: String,
    salary: String,
    location: String,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
