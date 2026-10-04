const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { buildEnquiryEmail, substituteTokens, normaliseEnquiry } = require("./enquiryEmailTemplate");

// Initialize Resend if API key is provided
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

// Initialize Brevo if API key is provided
const brevoKey = process.env.BREVO_API_KEY;

// Initialize Nodemailer fallback
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  family: 4 // Force IPv4 to fix Render's IPv6 ENETUNREACH error
});

const clientBaseUrl = () => (process.env.CLIENT_URL || "").trim().replace(/\/$/, "");

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
const enquiryViewUrl = (enquiry, type) => {
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
    viewUrl: enquiryViewUrl(enquiry, type),
  });

  return { subject, html, tokenValues: norm.tokenValues };
};

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (brevoKey) {
    const payload = {
      sender: { name: "Mount Carmel School", email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
      attachment: attachments.length > 0 ? attachments.map(att => ({
        name: att.filename,
        content: att.content.toString('base64')
      })) : undefined
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Brevo API Error:", errorData);
      throw new Error(errorData.message || `Brevo API error: ${response.status}`);
    }
    
    return await response.json();
  } else if (resend) {
    const mappedAttachments = attachments.map(att => ({
      filename: att.filename,
      content: att.content
    }));
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
      attachments: mappedAttachments.length > 0 ? mappedAttachments : undefined
    });
    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }
    return data;
  } else {
    try {
      return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        attachments
      });
    } catch (err) {
      if (err.code === 'ETIMEDOUT') {
        throw new Error('SMTP Connection timed out. Port 465 is blocked by your host.');
      }
      throw err;
    }
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
