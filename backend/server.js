const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectRoutes');
const recurringDonationRoutes = require('./routes/recurringDonationRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.log("Error: " + err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', recurringDonationRoutes);
app.use('/api', investmentRoutes);
app.use('/api', milestoneRoutes);
app.use('/api', notificationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  