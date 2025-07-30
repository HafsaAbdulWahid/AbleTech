const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String },
    resume: {
        filename: String,
        contentType: String,
        data: Buffer
    }
}, { timestamps: true });

module.exports = mongoose.model("UserBasicDetails", userDetailsSchema);
