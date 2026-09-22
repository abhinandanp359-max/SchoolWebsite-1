const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' && error.syscall === 'querySrv') {
      console.log('Local SRV DNS lookup failed, falling back to public DNS (8.8.8.8)...');
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected via DNS fallback: ${conn.connection.host}`);
        return;
      } catch (dnsErr) {
        console.error(`MongoDB connection error after DNS fallback: ${dnsErr.message}`);
        process.exit(1);
      }
    }
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
