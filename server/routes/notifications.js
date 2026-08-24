const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { renderEnquiryEmail, sendCustomEmail } = require('../utils/email');
const {
  buildEnquiryEmail,
  substituteTokens,
  normaliseEnquiry,
  BRAND,
  escapeHtml,
} = require('../utils/enquiryEmailTemplate');

const clientBaseUrl = () => (process.env.CLIENT_URL || '').replace(/\/$/, '');

/* Hosted logo URL (inline display, never an attachment) */
const logoUrl = () => {
  const base = clientBaseUrl();
  return base ? `${base}/images/branding/logo.png` : '';
};

/* Deep link to the exact enquiry record (falls back to enquiries list) */
const enquiryViewUrl = (enquiry) => {
  const id = enquiry?._id || enquiry?.id;
  const base = clientBaseUrl();
  if (!base || !id) return base ? `${base}/admin/enquiries` : '';
  return `${base}/admin/enquiries/${id}`;
};

/* Config for the composer UI: default recipient + insertable fields */
router.get('/config', protect, (req, res) => {
  res.json({
    success: true,
    data: {
      notifyEmail: process.env.NOTIFY_EMAIL || '',
      clientUrl: process.env.CLIENT_URL || '',
      fromEmail: process.env.EMAIL_USER || '',
      fields: [
        { token: 'type', label: 'Enquiry Type' },
        { token: 'studentName', label: 'Student Name' },
        { token: 'parentName', label: 'Parent Name' },
        { token: 'className', label: 'Class' },
        { token: 'name', label: 'Name' },
        { token: 'phone', label: 'Phone' },
        { token: 'email', label: 'Email' },
        { token: 'message', label: 'Message' },
      ],
    },
  });
});

/*
 * Render the ACTUAL final email HTML for the composed message.
 * The composer preview displays exactly what will be sent to the user.
 * Body: { type: 'Admission Enquiry' | 'Contact Enquiry', enquiry: {...}, subject, message }
 */
router.post('/preview', protect, (req, res) => {
  try {
    const { type, enquiry = {}, subject = '', message = '' } = req.body || {};
    if (!['Admission Enquiry', 'Contact Enquiry'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry type' });
    }

    const norm = normaliseEnquiry({ ...enquiry, type });
    const finalSubject = substituteTokens(subject || '(No subject)', norm.tokenValues);
    const finalHtml = buildComposedEmail({
      heading: finalSubject,
      body: substituteTokens(message || 'No message content provided.', norm.tokenValues),
    });

    res.json({ success: true, data: { html: finalHtml, subject: finalSubject, title: finalSubject } });
  } catch (error) {
    console.error('Preview render error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to render preview' });
  }
});

/*
 * Send the rendered enquiry notification as a TEST email
 * through the existing transport. Body: { type, enquiry, to? }
 */
router.post('/test', protect, async (req, res, next) => {
  try {
    const { type, enquiry = {}, to } = req.body || {};
    if (!['Admission Enquiry', 'Contact Enquiry'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry type' });
    }

    const recipient = to || process.env.NOTIFY_EMAIL;
    if (!recipient) {
      return res.status(400).json({ success: false, message: 'No recipient email configured' });
    }

    const { subject, html } = renderEnquiryEmail({ type, enquiry });
    await sendCustomEmail({
      to: recipient,
      subject: `[TEST] ${subject}`,
      html,
    });

    res.json({ success: true, message: `Test notification sent to ${recipient}` });
  } catch (error) {
    next(error);
  }
});

/*
 * Send a composed email from the notification composer.
 * Body: { to, subject, message, attachments?: [{ filename, contentType, content(base64) }] }
 * {{tokens}} in subject/message are replaced with values from the selected enquiry.
 * Body may include `tokenValues` sourced from an existing enquiry record.
 */
router.post('/send', protect, async (req, res, next) => {
  try {
    const { to, subject, message = '', tokenValues = {}, attachments = [], enquiryId, type } = req.body || {};
    if (!to) return res.status(400).json({ success: false, message: 'Recipient is required' });
    if (!subject && !message) {
      return res.status(400).json({ success: false, message: 'Subject or message is required' });
    }

    const safeAttachments = Array.isArray(attachments)
      ? attachments.slice(0, 5).map((a) => ({
          filename: String(a.filename || 'attachment').slice(0, 120),
          contentType: a.contentType || 'application/octet-stream',
          content: Buffer.from(String(a.content || ''), 'base64'),
        }))
      : [];

    const finalSubject = substituteTokens(subject || '(No subject)', tokenValues);
    const finalHtml = buildComposedEmail({
      heading: substituteTokens(finalSubject, tokenValues),
      body: substituteTokens(message, tokenValues),
    });

    await sendCustomEmail({ to, subject: finalSubject, html: finalHtml, attachments: safeAttachments });

    // Automatically mark the enquiry as replied if we have its ID
    if (enquiryId && type) {
      const model = type === 'Admission Enquiry' ? require('../models/AdmissionEnquiry') : require('../models/ContactEnquiry');
      await model.findByIdAndUpdate(enquiryId, { status: 'replied' }).catch(err => console.error("Failed to mark as replied:", err));
    }

    res.json({ success: true, message: `Notification sent to ${to}` });
  } catch (error) {
    next(error);
  }
});

/* Simple branded wrapper for composed (free-text) emails */
const buildComposedEmail = ({ heading, body }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>@media only screen and (max-width:620px){ .mcs-pad{padding-left:20px !important;padding-right:20px !important;} }</style>
</head>
<body style="margin:0;padding:0;background-color:#f1ece1;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1ece1">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">
<tr><td bgcolor="#5a1920" align="center" style="background-color:#5a1920;padding:26px 32px;border-bottom:3px solid ${BRAND.gold};">
<img src="${logoUrl() || 'https://www.mountcarmelschool.in/images/branding/logo.png'}" alt="Mount Carmel School Logo" style="max-height: 50px; display: block; margin: 0 auto; object-fit: contain;" />
<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:22px;letter-spacing:2px;color:#fdfaf3;font-weight:bold;text-transform:uppercase;margin-top:10px;">Mount Carmel School</div>
</td></tr>
<tr><td class="mcs-pad" style="padding:30px 32px;">
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:29px;color:${BRAND.burgundy};margin:0 0 14px 0;">${escapeHtml(heading)}</h1>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;color:${BRAND.charcoal};word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap;">${escapeHtml(body)}</div>
</td></tr>
<tr><td bgcolor="#fbf8f1" align="center" style="background-color:#fbf8f1;border-top:1px solid ${BRAND.line};padding:20px 32px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#98a0a3;">This is an automated notification.</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
};

module.exports = router;
