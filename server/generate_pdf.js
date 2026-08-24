const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const docsDir = path.join(__dirname, '../client/public/docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 }
});

doc.pipe(fs.createWriteStream(path.join(docsDir, 'Mount-Carmel-School-Admission-Form.pdf')));

// Header
doc.font('Helvetica-Bold').fontSize(20).text('MOUNT CARMEL SCHOOL', { align: 'center' });
doc.font('Helvetica').fontSize(10).text('Vill. Chapra, Srinagar, P. O. Bangalj', { align: 'center' });
doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(16).text('NEW ADMISSION REGISTRATION FORM', { align: 'center', underline: true });
doc.moveDown(0.5);
doc.font('Helvetica-Oblique').fontSize(12).text('Motto: "Rooted in Values, Reaching for Excellence"', { align: 'center' });
doc.moveDown(2);

const drawLine = (text, yOffset) => {
  doc.font('Helvetica-Bold').fontSize(12).text(text, { continued: true });
  doc.font('Helvetica').text(' __________________________________________________________________');
  doc.moveDown(0.8);
};

// Form Sections
doc.font('Helvetica-Bold').fontSize(14).text('1. Student\'s Details', { underline: true });
doc.moveDown(0.5);
drawLine('Full Name:', 0);
drawLine('Date of Birth:', 0);
drawLine('Class to which admission is sought:', 0);
drawLine('Gender:', 0);
drawLine('Blood Group:', 0);
doc.moveDown(1);

doc.font('Helvetica-Bold').fontSize(14).text('2. Parent/Guardian Details', { underline: true });
doc.moveDown(0.5);
drawLine('Father\'s Name:', 0);
drawLine('Father\'s Occupation:', 0);
drawLine('Mother\'s Name:', 0);
drawLine('Mother\'s Occupation:', 0);
doc.moveDown(1);

doc.font('Helvetica-Bold').fontSize(14).text('3. Address & Contact Details', { underline: true });
doc.moveDown(0.5);
drawLine('Residential Address:', 0);
drawLine('City/Village:', 0);
drawLine('Pin Code:', 0);
drawLine('Phone Number:', 0);
drawLine('Email Address:', 0);
doc.moveDown(1);

doc.font('Helvetica-Bold').fontSize(14).text('4. Sibling Details (if studying in this school)', { underline: true });
doc.moveDown(0.5);
drawLine('Sibling Name & Class:', 0);
doc.moveDown(1);

doc.font('Helvetica-Bold').fontSize(14).text('5. Documents to be Submitted', { underline: true });
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(11)
   .text('[   ] Birth Certificate (Photocopy)')
   .text('[   ] Transfer Certificate (Original)')
   .text('[   ] Passport Size Photographs (3 copies)')
   .text('[   ] Aadhar Card (Photocopy)');
doc.moveDown(2);

// Declaration
doc.font('Helvetica-Bold').fontSize(14).text('DECLARATION', { underline: true });
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(10).text('I hereby declare that the information furnished above is true to the best of my knowledge. I agree to abide by the rules and regulations of Mount Carmel School.', { align: 'justify' });
doc.moveDown(3);

doc.text('_____________________________', 50, doc.y, { continued: false });
doc.text('Signature of Parent/Guardian', 50, doc.y + 5);
doc.text('_____________________________', 350, doc.y - 15, { continued: false });
doc.text('Date', 350, doc.y + 5);

// New Page for Office Use
doc.addPage();
doc.rect(40, 40, 515, 760).stroke();

doc.font('Helvetica-Bold').fontSize(16).text('FOR OFFICE USE ONLY', { align: 'center' });
doc.moveDown(2);

drawLine('Registration No:', 0);
drawLine('Date of Admission:', 0);
drawLine('Class Assigned:', 0);
drawLine('Receipt No:', 0);
doc.moveDown(3);

doc.text('Remarks:', 50, doc.y);
doc.font('Helvetica').text('____________________________________________________________________', 50, doc.y + 15);
doc.text('____________________________________________________________________', 50, doc.y + 15);
doc.text('____________________________________________________________________', 50, doc.y + 15);
doc.moveDown(8);

doc.font('Helvetica-Bold').text('_____________________________', 50, doc.y, { continued: false });
doc.text('Checked By (Office Clerk)', 50, doc.y + 5);

doc.font('Helvetica-Bold').text('_____________________________', 350, doc.y - 15, { continued: false });
doc.text('Principal\'s Signature & School Seal', 350, doc.y + 5);

doc.end();

console.log('PDF Generated Successfully!');
