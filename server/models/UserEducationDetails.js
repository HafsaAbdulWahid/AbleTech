const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  companyName: String,
  position: String,
  description: String,
});

const projectSchema = new mongoose.Schema({
  projectName: String,
  fieldWorked: String,
  description: String,
});

const educationDetailsSchema = new mongoose.Schema({
  instituteName: { type: String, required: true },
  qualification: { type: String, required: true },
  internships: [internshipSchema],
  project: projectSchema,
}, { timestamps: true });

module.exports = mongoose.model("UserEducationDetails", educationDetailsSchema);


