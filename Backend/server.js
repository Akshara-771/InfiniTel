require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connection.useDb("TelecomDBMS");
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Atlas Connected to:", mongoose.connection.name);
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // Should print your key
    console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET);

}).catch(err => console.log(err));




const authRoutes = require('./routes/authRoutes'); // Import authentication routes
app.use('/api/auth', authRoutes); // Use authentication routes


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriberPlanRoutes = require('./routes/subscriberPlanRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const areaRoutes = require("./routes/areaRoutes");


app.use("/api", areaRoutes);
app.use('/api', userRoutes);
app.use('/api', planRoutes);
app.use('/api', subscriberPlanRoutes);
app.use('/api', paymentRoutes);
