// Import Mongoose and dotenv to load environment variables
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB using Mongoose with URL from environment variable
const url = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const connect=await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(
      `You successfully connected to MongoDB at: ${connect.connection.host}, ${connect.connection.name}`
    );
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process if MongoDB connection fails
  }
};
module.exports=connectDB ;
// Call the connectDB function to establish the connection
//connectDB();

// Export Mongoose connection for use in other parts of the app
//module.exports = mongoose.connection;
