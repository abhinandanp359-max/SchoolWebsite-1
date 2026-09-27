require('dotenv').config({ path: './server/.env' });
const { cloudinary } = require('./server/config/cloudinary');
cloudinary.uploader.upload('./client/public/images/branding/logo-transparent.png', { folder: 'test' })
  .then(result => {
    console.log('Success secure_url:', result.secure_url);
    console.log('Success path:', result.path);
    console.log('Result Object:', Object.keys(result));
  })
  .catch(error => console.error('Error:', error));
