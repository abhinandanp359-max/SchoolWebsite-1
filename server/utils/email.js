const { Resend } = require('resend');
const { buildEnquiryEmail, substituteTokens, normaliseEnquiry } = require("./enquiryEmailTemplate");

// Initialize Resend with the provided API key from environment variables (or a dummy key to prevent crash on startup)
const resend = new Resend(process.env.RESEND_API_KEY || "missing_api_key");

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

const sendContactEmail = async (enquiry) => {
  const { subject, html } = renderEnquiryEmail({ type: "Contact Enquiry", enquiry });
  
  // Resend requires the "from" address to be a verified domain, or "onboarding@resend.dev" for testing.
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.NOTIFY_EMAIL,
    subject,
    html,
  });
};

const sendAdmissionEmail = async (enquiry) => {
  const { subject, html } = renderEnquiryEmail({ type: "Admission Enquiry", enquiry });
  
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.NOTIFY_EMAIL,
    subject,
    html,
  });
};

/**
 * Send a composed email through the existing transport
 * (used by the admin notification composer).
 */
const sendCustomEmail = async ({ to, subject, html, attachments = [] }) => {
  // Resend attachments format is slightly different than nodemailer, but we can adapt it if needed.
  // For now, we will just send the email without attachments or adapt the attachments format.
  const mappedAttachments = attachments.map(att => ({
    filename: att.filename,
    content: att.content
  }));

  return resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
    attachments: mappedAttachments
  });
};

const verifyTransporter = async () => {
  // Resend uses HTTP API, so no persistent connection to verify on startup.
  console.log("✓ Resend API configured. Emails will be sent via HTTP.");
  return true;
};

module.exports = {
  sendContactEmail,
  sendAdmissionEmail,
  sendCustomEmail,
  renderEnquiryEmail,
  verifyTransporter,
};
