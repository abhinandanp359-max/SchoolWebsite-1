# Google Sheets + Google Apps Script + Gmail Integration

This document outlines the setup process for integrating the Mount Carmel School website enquiries with a Google Sheet and sending automated Gmail notifications.

### Step 1
Create a new Google Sheet named **Mount Carmel School – Enquiries**.

### Step 2
Create the headers in Row 1:
`Timestamp` | `Type` | `Student Name` | `Parent Name` | `Class` | `Phone` | `Email` | `Message` | `Enquiry ID`

> The `Enquiry ID` column is the unique record identifier used by the **VIEW ENQUIRY**
> deep link in notification emails. It is appended as the last column so all existing
> columns and data remain unchanged.

### Step 3
Open **Extensions → Apps Script** from the Google Sheet menu.

### Step 4
Paste the generated `Code.gs` below into the Apps Script editor:

```javascript
function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const spreadsheetId = props.getProperty('SPREADSHEET_ID');
    const adminEmail = props.getProperty('ADMIN_EMAIL');
    
    if (!spreadsheetId) throw new Error('SPREADSHEET_ID is missing');
    if (!adminEmail) throw new Error('ADMIN_EMAIL is missing');

    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
    
    const timestamp = new Date();
    const enquiryId = data.id || '';
    const type = data.type || 'Unknown Enquiry';
    const studentName = data.studentName || '';
    const parentName = data.parentName || '';
    const className = data.className || '';
    const phone = data.phone || '';
    const email = data.email || '';
    const message = data.message || '';
    
    // 1. Append to Sheet (Enquiry ID added as the last column — existing columns untouched)
    sheet.appendRow([
      timestamp,
      type,
      studentName,
      parentName,
      className,
      phone,
      email,
      message,
      enquiryId
    ]);
    
    // 2. Send Email
    const subject = type === 'Admission Enquiry' 
      ? 'New Admission Enquiry - Mount Carmel School'
      : 'New Contact Enquiry - Mount Carmel School';
      
    const emailBody = `Mount Carmel School
New Enquiry Received

Type: ${type}
Student Name: ${studentName}
Parent Name: ${parentName}
Class: ${className}
Phone: ${phone}
Email: ${email}
Message: ${message}
Submitted At: ${timestamp.toLocaleString()}
`;

    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      body: emailBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 5
Configure the Script Properties:
1. On the left sidebar in Apps Script, click the **Project Settings** (gear icon).
2. Scroll down to **Script Properties**.
3. Add a new property:
   - Property: `SPREADSHEET_ID`
   - Value: (Copy the ID from your Google Sheet URL, it's the long string between `/d/` and `/edit`)
4. Add another property:
   - Property: `ADMIN_EMAIL`
   - Value: (e.g., admin@mountcarmelschool.edu.in)
5. Save script properties.

### Step 6
Deploy the Web App:
1. Click the blue **Deploy** button at the top right, then **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under "Execute as", select **Me (your Google account)**.
4. Under "Who has access", select **Anyone**.
5. Click **Deploy**. (You will be prompted to authorize the script to access your Sheets and Gmail. Click "Review permissions", choose your account, click "Advanced", and proceed).

### Step 7
Copy the generated **Web app URL**.

### Step 8
Put it into the backend `.env` file of the Node.js server:
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_URL/exec
```

### Step 9
Restart the Node.js server to apply the `.env` changes.

### Step 10
Test Admission Enquiry:
- Navigate to the Admissions page on the website.
- Fill out the form with test data and click Submit.
- Verify the success message appears on the website.

### Step 11
Test Contact Enquiry:
- Navigate to the Contact page.
- Fill out the form and submit.
- Verify:
  - Both enquiries appear in the Google Sheet.
  - Emails are received at the configured `ADMIN_EMAIL` address.
