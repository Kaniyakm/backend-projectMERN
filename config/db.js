// backend/config/db.js
/* 
  PHASE 1 — DB CONNECTION
  - Connects to MongoDB Atlas
  - Called in server.js
*/
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;