const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(require('cors')());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));


// Routes
const projectRoutes = require('./routes/project.routes');
const milestoneRoutes = require('./routes/milestone.routes');
const userRoutes = require('./routes/user.routes'); // Adjust path if necessary
const metricsRoutes = require('./routes/metrics.routes'); // Adjust the path to your metrics file
const investmentRoutes = require('./routes/investment.routes'); // Adjust path if needed

app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/users', userRoutes); // Use user routes
app.use('/api/metrics', metricsRoutes); // This will add the /api/metrics route
app.use('/api/investments', investmentRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
