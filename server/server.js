const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const seedAdmin = require('./utils/seeds');

const { verifyTransporter } = require('./utils/email');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');
const galleryRoutes = require('./routes/gallery');
const admissionRoutes = require('./routes/admissions');
const contactRoutes = require('./routes/contact');
const enquiryRoutes = require('./routes/enquiries');
const uploadRoutes = require('./routes/upload');

const app = express();

// Trust the first proxy (required for express-rate-limit on Render/Vercel/Heroku)
app.set('trust proxy', 1);

connectDB().then(() => {
  seedAdmin();
});

app.use(helmet({
  crossOriginResourcePolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://schoolwebsite-1-5.onrender.com"],
    },
  },
}));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
});
app.use(limiter);

app.use(cors({
  origin: (origin, callback) => {
    // In production, we expect FRONTEND_URL to be set, but we also allow same-origin requests dynamically
    if (process.env.NODE_ENV === 'production') {
      const allowed = process.env.FRONTEND_URL || 'https://schoolwebsite-1-6.onrender.com';
      if (!origin || origin === allowed) {
        return callback(null, true);
      }
      return callback(null, false); // Return false instead of throwing Error to prevent 500s
    }
    
    // In dev, allow Postman/curl (no origin) or localhost
    const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'];
    if (!origin || devOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/upload', uploadRoutes);

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Catch-all route to serve the React app for any unhandled routes
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Mount Carmel School API is running' });
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  verifyTransporter();
});

module.exports = app;
