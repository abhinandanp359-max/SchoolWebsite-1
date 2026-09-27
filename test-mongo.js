const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Event = require('./server/models/Event');
    const events = await Event.find().sort({ date: -1 }).limit(3);
    console.log(JSON.stringify(events, null, 2));
    process.exit(0);
  });
