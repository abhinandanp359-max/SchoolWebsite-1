const { buildEnquiryEmail } = require('./utils/enquiryEmailTemplate.js');
const fs = require('fs');

const sampleEnquiry = {
  type: 'Admission Enquiry',
  studentName: 'John Doe',
  parentName: 'Jane Doe',
  className: 'Grade 10',
  phone: '+1 234 567 8900',
  email: 'jane.doe@example.com',
  message: 'We would like to know more about the admission process for the upcoming academic year.',
  submittedAt: new Date().toISOString()
};

const html = buildEnquiryEmail({
  type: 'Admission Enquiry',
  enquiry: sampleEnquiry,
  viewUrl: 'http://localhost:5173/admin/enquiries/123',
  extraNote: 'Looks like a priority admission lead.'
});

fs.writeFileSync('test-email.html', html);
console.log('test-email.html created.');
