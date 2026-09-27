require('dotenv').config({ path: './server/.env' });
const { upload } = require('./server/config/cloudinary');
const express = require('express');
const app = express();
app.post('/test', upload.single('image'), (req, res) => {
  res.json(req.file);
});
app.listen(3333, () => console.log('Listening on 3333'));
