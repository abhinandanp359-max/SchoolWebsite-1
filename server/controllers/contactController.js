const ContactEnquiry = require('../models/ContactEnquiry');
const { sendContactEmail } = require('../utils/email');
const ExcelJS = require('exceljs');

exports.createContact = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.create(req.body);
    sendContactEmail(enquiry).catch((err) => console.error('Email send failed:', err.message));
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) {
      return res.status(404).json({ message: 'Contact enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.exportContactsExcel = async (req, res, next) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mount Carmel School Admin';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Contact Enquiries', {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    });

    sheet.columns = [
      { header: 'TIMESTAMP', key: 'timestamp', width: 22 },
      { header: 'NAME',      key: 'name',      width: 22 },
      { header: 'PHONE',     key: 'phone',     width: 16 },
      { header: 'EMAIL',     key: 'email',     width: 28 },
      { header: 'MESSAGE',   key: 'message',   width: 40 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
      cell.font   = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.border = {
        top:    { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left:   { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right:  { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    });
    headerRow.height = 28;

    enquiries.forEach((enq, idx) => {
      const row = sheet.addRow({
        timestamp: new Date(enq.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name:      enq.name    || '-',
        phone:     enq.phone   || '-',
        email:     enq.email   || '-',
        message:   enq.message || '-',
      });

      const bg = idx % 2 === 0 ? 'FFFAFAFA' : 'FFF0F4F8';
      row.eachCell((cell) => {
        cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.font      = { size: 10 };
        cell.border    = {
          top:    { style: 'hair', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'hair', color: { argb: 'FFE0E0E0' } },
          left:   { style: 'hair', color: { argb: 'FFE0E0E0' } },
          right:  { style: 'hair', color: { argb: 'FFE0E0E0' } },
        };
      });
      row.height = 22;
    });

    sheet.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2' }];

    const filename = `Contact_Enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Contact enquiry not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.deleteContactsBulk = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided for deletion' });
    }
    const result = await ContactEnquiry.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};
