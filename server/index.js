const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require("./models/User");

dotenv.config();
const app = express();

// 1) MIDDLEWARE 
app.use(cors());
app.use(express.json());

// 2) ROUTE
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// 3) MONGO DB CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// 4) SERVER
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});
