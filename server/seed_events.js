const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
};

const cleanupEvents = async () => {
  await connectDB();
  try {
    // Delete the specific events I just added
    await Event.deleteMany({
      title: { $in: ['Annual Sports Meet 2026', 'Science & Innovation Exhibition', 'Cultural Fest & Annual Day'] }
    });
    console.log('Cleaned up the auto-added events.');
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

cleanupEvents();
