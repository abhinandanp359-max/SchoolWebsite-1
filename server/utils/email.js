const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { buildEnquiryEmail, substituteTokens, normaliseEnquiry } = require("./enquiryEmailTemplate");

// Initialize Resend if API key is provided
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

// Initialize Nodemailer fallback
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const clientBaseUrl = () => (process.env.CLIENT_URL || "").replace(/\/$/, "");

/*
 * Logo shown at the top of every notification email.
 * Hosted URL (not an attachment) — displays inline like a normal newsletter
 * image and never appears in the recipient's attachment list.
 * NOTE: the URL becomes fully loadable once CLIENT_URL points to the live domain;
 * on localhost Gmail's image proxy cannot fetch it and shows the alt text instead.
 */
const logoUrl = () => {
  const base = clientBaseUrl();
  return base ? `${base}/images/branding/logo.png` : "";
};

/* Fallback link when no specific enquiry id is available */
const adminEnquiriesUrl = () => {
  const base = clientBaseUrl();
  return base ? `${base}/admin/enquiries` : "";
};

/*
 * Deep link to the EXACT enquiry record that generated this email.
 * Uses the unique Mongo _id — never names/phones/emails.
 */
const enquiryViewUrl = (enquiry) => {
  const id = enquiry?._id || enquiry?.id;
  const base = clientBaseUrl();
  if (!base || !id) return adminEnquiriesUrl();
  return `${base}/admin/enquiries/${id}`;
};

/**
 * Render the final notification email (subject + html) for any enquiry record.
 * Used by sendAdmissionEmail / sendContactEmail / test endpoint / live preview.
 */
const renderEnquiryEmail = ({ type, enquiry }) => {
  const norm = normaliseEnquiry({ ...enquiry, type });
  const subject =
    type === "Admission Enquiry"
      ? `New Admission Enquiry — ${enquiry.studentName || ""}`.trim()
      : `New Contact Enquiry — ${enquiry.name || ""}`.trim();

  const html = buildEnquiryEmail({
    type,
    enquiry,
    logoSrc: logoUrl(),
    viewUrl: enquiryViewUrl(enquiry),
  });

  return { subject, html, tokenValues: norm.tokenValues };
};

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (resend) {
    const mappedAttachments = attachments.map(att => ({
      filename: att.filename,
      content: att.content
    }));
    return resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
      attachments: mappedAttachments.length > 0 ? mappedAttachments : undefined
    });
  } else {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments
    });
  }
};

const sendContactEmail = async (enquiry) => {
  const { subject, html } = renderEnquiryEmail({ type: "Contact Enquiry", enquiry });
  return sendEmail({ to: process.env.NOTIFY_EMAIL, subject, html });
};

const sendAdmissionEmail = async (enquiry) => {
  const { subject, html } = renderEnquiryEmail({ type: "Admission Enquiry", enquiry });
  return sendEmail({ to: process.env.NOTIFY_EMAIL, subject, html });
};

/**
 * Send a composed email through the existing transport
 * (used by the admin notification composer).
 */
const sendCustomEmail = async ({ to, subject, html, attachments = [] }) => {
  return sendEmail({ to, subject, html, attachments });
};

const verifyTransporter = async () => {
  if (resend) {
    console.log("✓ Resend API configured. Emails will be sent via HTTP.");
    return true;
  } else {
    try {
      await transporter.verify();
      console.log("✓ Nodemailer (Gmail) configured as fallback. Ready to send emails.");
      return true;
    } catch (err) {
      console.error("Transporter verification failed:", err);
      return false;
    }
  }
};

module.exports = {
  sendContactEmail,
  sendAdmissionEmail,
  sendCustomEmail,
  renderEnquiryEmail,
  verifyTransporter,
};
