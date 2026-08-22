const AdmissionEnquiry = require('../models/AdmissionEnquiry');
const ContactEnquiry = require('../models/ContactEnquiry');

exports.submitEnquiry = async (req, res, next) => {
  try {
    const { type, studentName, parentName: reqParentName, name, className, phone, email, message } = req.body;
    let parentName = reqParentName || name;
    let savedEnquiry = null;

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate phone format (if provided)
    if (phone && phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Save to appropriate MongoDB collection based on type
    if (type === 'Admission Enquiry') {
      if (!studentName || !parentName || !phone) {
        return res.status(400).json({ success: false, message: 'Student Name, Parent Name, and Phone are required' });
      }
      savedEnquiry = await AdmissionEnquiry.create({
        studentName,
        parentName,
        className,
        phone,
        email,
        message
      });
    } else if (type === 'Contact Enquiry') {
      if (!parentName || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, Email, and Message are required' });
      }
      // Note: mapping parentName to ContactEnquiry's name field
      savedEnquiry = await ContactEnquiry.create({
        name: parentName,
        email,
        phone,
        message
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid enquiry type' });
    }

    // Forward to Google Apps Script Web App
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (scriptUrl) {
      try {
        const payload = {
          type,
          studentName: studentName || '',
          parentName: parentName || '',
          className: className || '',
          phone: phone || '',
          email: email || '',
          message: message || ''
        };

        const response = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error('Failed to send enquiry to Google Apps Script', response.statusText);
        }
      } catch (err) {
        console.error('Error sending enquiry to Google Apps Script:', err.message);
      }
    } else {
      console.warn('GOOGLE_APPS_SCRIPT_URL is not defined in environment variables.');
    }

    // Return clean success to React
    res.status(201).json({ success: true, data: savedEnquiry });
  } catch (error) {
    console.error('Enquiry Submission Error:', error);
    // Do not expose MongoDB/technical errors to user
    res.status(500).json({ success: false, message: "We couldn't submit your enquiry right now. Please try again or contact the school directly." });
  }
};
