/**
 * ONE reusable, email-client-safe HTML template for ALL enquiry notifications
 * (Admission Enquiry + Contact Enquiry).
 *
 * Uses table-based layout + inline styles only (Gmail / Outlook safe).
 */

const BRAND = {
  burgundy: '#722129',
  burgundyDark: '#5a1920',
  gold: '#c9a84c',
  goldSoft: '#b8933d',
  ivory: '#f8f6f0',
  cardBg: '#fbf8f1',
  line: '#eadfc8',
  charcoal: '#2d3436',
  warmGray: '#636e72',
};

const escapeHtml = (value) =>
  String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatSubmittedAt = (date) => {
  const d = date ? new Date(date) : new Date();
  if (Number.isNaN(d.getTime())) return outer;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const substituteTokens = (text, values = {}) => {
  if (!text) return '';
  return String(text).replace(/\{\{\s*([a-zA-Z]+)\s*\}\}/g, (match, key) => {
    const v = values[key];
    return v === undefined || v === null ? '' : String(v);
  });
};

/* ---------- field definitions per enquiry type (existing data mapping) ---------- */

const admissionFields = (enquiry) => {
  const fields = [
    { label: 'Type', key: 'type', value: 'Admission Enquiry' },
    { label: 'Student Name', key: 'studentName', value: enquiry.studentName },
    { label: 'Parent Name', key: 'parentName', value: enquiry.parentName },
    { label: 'Class', key: 'className', value: enquiry.className },
    { label: 'Phone', key: 'phone', value: enquiry.phone },
    { label: 'Email', key: 'email', value: enquiry.email },
  ].filter((f) => f.value); // hide fields that do not exist on this record
  return fields;
};

const contactFields = (enquiry) => {
  const fields = [
    { label: 'Type', key: 'type', value: 'Contact Enquiry' },
    { label: 'Name', key: 'name', value: enquiry.name },
    { label: 'Phone', key: 'phone', value: enquiry.phone }, // only shown when present
    { label: 'Email', key: 'email', value: enquiry.email },
    { label: 'Subject', key: 'subject', value: enquiry.subject }, // only shown when present
  ].filter((f) => f.value);
  return fields;
};

/**
 * Normalise any enquiry record into the shape the template needs,
 * automatically detecting Admission vs Contact type.
 */
const normaliseEnquiry = (raw) => {
  const isAdmission =
    raw.type === 'Admission Enquiry' ||
    raw.studentName !== undefined ||
    raw.parentName !== undefined ||
    raw.className !== undefined;

  if (isAdmission) {
    const enquiry = { ...raw };
    return {
      type: 'Admission Enquiry',
      title: 'New Admission Enquiry',
      subtitle: 'A new enquiry has been received.',
      enquiry,
      fields: admissionFields(enquiry),
      message: enquiry.message,
      submittedAt: formatSubmittedAt(enquiry.submittedAt || enquiry.createdAt),
      tokenValues: {
        type: 'Admission Enquiry',
        studentName: enquiry.studentName || '',
        parentName: enquiry.parentName || '',
        className: enquiry.className || '',
        class: enquiry.className || '',
        phone: enquiry.phone || '',
        email: enquiry.email || '',
        name: enquiry.studentName || '',
        message: enquiry.message || '',
      },
    };
  }

  const enquiry = { ...raw };
  return {
    type: 'Contact Enquiry',
    title: 'New Contact Enquiry',
    subtitle: 'A new enquiry has been received.',
    enquiry,
    fields: contactFields(enquiry),
    message: enquiry.message,
    submittedAt: formatSubmittedAt(enquiry.submittedAt || enquiry.createdAt),
    tokenValues: {
      type: 'Contact Enquiry',
      name: enquiry.name || '',
      phone: enquiry.phone || '',
      email: enquiry.email || '',
      subject: enquiry.subject || '',
      message: enquiry.message || '',
    },
  };
};

/* ---------- small building blocks (all inline-styled tables) ---------- */

const fieldCell = (field) => `
  <div style="margin:0;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.goldSoft};font-weight:bold;margin:0 0 4px 0;">${escapeHtml(field.label)}</div>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${BRAND.charcoal};font-weight:bold;word-break:break-word;overflow-wrap:anywhere;margin:0;">${escapeHtml(field.value)}</div>
  </div>`;

/**
 * Info grid: two columns on desktop, single column on mobile.
 * Built as rows of paired cells; a trailing odd field spans full width.
 */
const infoGrid = (fields) => {
  if (!fields.length) return '';
  const rows = [];
  for (let i = 0; i < fields.length; i += 2) {
    const pair = [fields[i], fields[i + 1]].filter(Boolean);
    const isLastRow = i + 2 >= fields.length;
    const borderStyle = isLastRow ? '' : `border-bottom:1px solid ${BRAND.line};`;

    let rowHtml = '<tr>';
    if (pair.length === 2) {
      rowHtml += `
        <td class="mcs-stack" width="50%" valign="top" style="padding:16px 18px;${borderStyle}">${fieldCell(pair[0])}</td>
        <td class="mcs-stack" width="50%" valign="top" style="padding:16px 18px;${borderStyle}">${fieldCell(pair[1])}</td>`;
    } else {
      rowHtml += `<td class="mcs-stack" colspan="2" valign="top" style="padding:16px 18px;${borderStyle}">${fieldCell(pair[0])}</td>`;
    }
    rowHtml += '</tr>';
    rows.push(rowHtml);
  }
  return rows.join('');
};

const bulletproofButton = ({ href, label, variant }) => {
  if (variant === 'solid') {
    return `
      <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;background-color:${BRAND.burgundy};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:13px 26px;border-radius:6px;text-decoration:none;">
        ${escapeHtml(label)}
      </a>`;
  }
  return `
    <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;background-color:#ffffff;color:${BRAND.burgundy};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:11px 24px;border-radius:6px;border:2px solid ${BRAND.gold};text-decoration:none;">
      ${escapeHtml(label)}
    </a>`;
};

/**
 * Build the complete notification email.
 */
const buildEnquiryEmail = ({
  type,
  enquiry,
  logoSrc = '',
  viewUrl = '',
  includeActions = true,
  extraNote = '',
}) => {
  const norm = normaliseEnquiry({ ...enquiry, type });
  const year = new Date().getFullYear();

  const actionsHtml = includeActions && viewUrl
    ? `
    <tr>
      <td style="padding:26px 32px 30px 32px;" align="left">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td class="mcs-stack" style="padding:0 10px 10px 0;">
              ${bulletproofButton({ href: viewUrl, label: 'View Enquiry', variant: 'solid' })}
            </td>
            ${norm.enquiry.email ? `
            <td class="mcs-stack" style="padding:0;">
              ${bulletproofButton({ href: `mailto:${norm.enquiry.email}`, label: 'Reply', variant: 'outline' })}
            </td>` : ''}
          </tr>
        </table>
      </td>
    </tr>`
    : '';

  const noteHtml = extraNote
    ? `
    <tr>
      <td style="padding:4px 32px 8px 32px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.goldSoft};font-weight:bold;margin:0 0 4px 0;">Admin Note</div>
        <div style="background-color:#ffffff;border:1px solid ${BRAND.line};border-radius:8px;padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${BRAND.charcoal};word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap;">${escapeHtml(extraNote)}</div>
      </td>
    </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(norm.title)}</title>
  <style type="text/css">
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .mcs-wrapper { width: 100% !important; }
      .mcs-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .mcs-stack { display: block !important; width: 100% !important; box-sizing: border-box; }
      .mcs-btn-cell { padding-bottom: 10px !important; }
      .mcs-title { font-size: 21px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f1ece1;">
  <div style="display:none;font-size:1px;color:#f1ece1;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(norm.title)} &mdash; Mount Carmel School official notification.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1ece1" style="background-color:#f1ece1;">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" class="mcs-wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">

          <!-- ===== Header: logo + school identity ===== -->
          <tr>
            <td bgcolor="#5a1920" align="center" style="background-color:#5a1920;padding:30px 32px 24px 32px;border-bottom:3px solid ${BRAND.gold};">
              ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" width="72" height="72" alt="Mount Carmel School Logo" style="display:block;margin:0 auto 12px auto;border-radius:8px;" />` : ''}
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;letter-spacing:3px;color:#fdfaf3;font-weight:bold;text-transform:uppercase;">Mount Carmel School</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:16px;letter-spacing:3px;color:${BRAND.gold};text-transform:uppercase;font-weight:bold;margin-top:6px;">Official Notification</div>
            </td>
          </tr>

          <!-- ===== Dynamic title ===== -->
          <tr>
            <td class="mcs-pad" align="center" style="padding:32px 32px 6px 32px;">
              <h1 class="mcs-title" style="font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:32px;color:${BRAND.burgundy};font-weight:bold;margin:0;">${escapeHtml(norm.title)}</h1>
              <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${BRAND.warmGray};margin:8px 0 0 0;">${escapeHtml(norm.subtitle)}</p>
            </td>
          </tr>

          <!-- ===== Enquiry information card ===== -->
          <tr>
            <td class="mcs-pad" style="padding:22px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbf8f1" style="background-color:#fbf8f1;border:1px solid ${BRAND.line};border-radius:10px;">
                <tr>
                  <td colspan="2" style="padding:14px 18px 12px 18px;border-bottom:1px solid ${BRAND.line};">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:15px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.burgundy};font-weight:bold;">Enquiry Information</div>
                  </td>
                </tr>
                <tr>
                  <td class="mcs-stack" width="50%" valign="top" style="padding:16px 18px;border-bottom:1px solid ${BRAND.line};">${fieldCell({ label: 'Type', value: norm.type })}</td>
                  <td class="mcs-stack" width="50%" valign="top" style="padding:16px 18px;border-bottom:1px solid ${BRAND.line};">${fieldCell({ label: 'Submitted At', value: norm.submittedAt })}</td>
                </tr>
                ${infoGrid(norm.fields.filter((f) => f.label !== 'Type'))}
              </table>
            </td>
          </tr>

          <!-- ===== Message card ===== -->
          ${norm.message ? `
          <tr>
            <td class="mcs-pad" style="padding:18px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 8px 0;">
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:15px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.burgundy};font-weight:bold;">Message</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="background-color:#fffdf7;border:1px solid ${BRAND.line};border-left:4px solid ${BRAND.gold};border-radius:8px;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;color:${BRAND.charcoal};word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap;">${escapeHtml(norm.message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}
          ${noteHtml}

          <!-- ===== Action buttons ===== -->
          ${actionsHtml}

          <!-- ===== Footer ===== -->
          <tr>
            <td bgcolor="#fbf8f1" align="center" style="background-color:#fbf8f1;border-top:1px solid ${BRAND.line};padding:22px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;line-height:18px;font-weight:bold;color:${BRAND.charcoal};">Mount Carmel School</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#98a0a3;margin-top:4px;">This is an automated notification.</div>
            </td>
          </tr>

        </table>

        <!-- preheader spacer -->
        <div style="height:24px;font-size:1px;line-height:1px;">&nbsp;</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = {
  BRAND,
  escapeHtml,
  formatSubmittedAt,
  substituteTokens,
  normaliseEnquiry,
  buildEnquiryEmail,
};
