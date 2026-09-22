const AdmissionEnquiry = require('../models/AdmissionEnquiry');
const { sendAdmissionEmail } = require('../utils/email');
const ExcelJS = require('exceljs');

exports.createAdmission = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.create(req.body);
    sendAdmissionEmail(enquiry).catch((err) => console.error('Email send failed:', err.message));
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.getAdmissions = async (req, res, next) => {
  try {
    const enquiries = await AdmissionEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

exports.updateAdmission = async (req, res, next) => {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) {
      return res.status(404).json({ message: 'Admission enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.exportAdmissionsExcel = async (req, res, next) => {
  try {
    const enquiries = await AdmissionEnquiry.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mount Carmel School Admin';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Admission Enquiries', {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    });

    // ── Column definitions ──────────────────────────────────────────────────
    sheet.columns = [
      { header: 'TIMESTAMP',    key: 'timestamp',    width: 22 },
      { header: 'TYPE',         key: 'type',         width: 16 },
      { header: 'STUDENT NAME', key: 'studentName',  width: 22 },
      { header: 'PARENT NAME',  key: 'parentName',   width: 22 },
      { header: 'CLASS',        key: 'className',    width: 12 },
      { header: 'PHONE',        key: 'phone',        width: 16 },
      { header: 'EMAIL',        key: 'email',        width: 28 },
      { header: 'MESSAGE',      key: 'message',      width: 40 },
    ];

    // ── Header row styling ──────────────────────────────────────────────────
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

    // ── Data rows ───────────────────────────────────────────────────────────
    enquiries.forEach((enq, idx) => {
      const row = sheet.addRow({
        timestamp:   new Date(enq.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        type:        'Admission Enquiry',
        studentName: enq.studentName || '-',
        parentName:  enq.parentName  || '-',
        className:   enq.className   || '-',
        phone:       enq.phone       || '-',
        email:       enq.email       || '-',
        message:     enq.message     || '-',
      });

      // Alternate row background
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

    // ── Auto-freeze header row ──────────────────────────────────────────────
    sheet.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2' }];

    // ── Stream to client ────────────────────────────────────────────────────
    const filename = `Admission_Enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
