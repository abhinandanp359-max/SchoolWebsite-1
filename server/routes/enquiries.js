const express = require('express');
const router = express.Router();
const { submitEnquiry } = require('../controllers/enquiryController');
const { viewEnquiry } = require('../controllers/enquiryViewController');
const { protect } = require('../middleware/auth');

// Public: form submissions (existing behaviour, untouched)
router.post('/', submitEnquiry);

// Protected: resolve the exact enquiry by unique id (View Enquiry deep link)
router.get('/:id/view', protect, viewEnquiry);

module.exports = router;
