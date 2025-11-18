# Email Testing Guide

## 📧 Email Route Testing

### 1. Check Email Configuration

**GET** `http://localhost:5000/api/email/config`

```bash
curl http://localhost:5000/api/email/config
```

**Response:**
```json
{
  "success": true,
  "configured": true,
  "service": "gmail",
  "email": "you***",
  "contactEmail": "dragdroperp@gmail.com",
  "message": "Email service is configured and ready"
}
```

### 2. Send Test Email

**POST** `http://localhost:5000/api/email/test`

**Request Body:**
```json
{
  "name": "Test User",
  "email": "your-email@gmail.com",
  "phone": "1234567890",
  "reason": "general",
  "message": "This is a test email from the API"
}
```

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-email@gmail.com",
    "phone": "1234567890",
    "reason": "general",
    "message": "This is a test email from the API"
  }'
```

**Using Postman:**
1. Import `POSTMAN_COLLECTION.json` into Postman
2. Select "Email - Send Test Email"
3. Update the email in the request body
4. Click "Send"

**Response (Success):**
```json
{
  "success": true,
  "message": "Test email sent successfully!",
  "details": {
    "to": "your-email@gmail.com",
    "subject": "New general from Test User",
    "sent": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Email service is not configured",
  "details": "Make sure EMAIL_USER and EMAIL_PASSWORD are configured in .env"
}
```

## 🔧 Email Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Drag & Drop ERP"
   - Copy the 16-character password

3. **Update `.env`:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   CONTACT_EMAIL=dragdroperp@gmail.com
   ```

### Other Email Services

**SendGrid:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```env
EMAIL_SERVICE=mailgun
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

## 📋 Test Scenarios

### Test 1: Basic Email Test
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "reason": "general",
  "message": "Hello, this is a test"
}
```

### Test 2: Support Request
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "reason": "support",
  "message": "I need help with my account"
}
```

### Test 3: Sales Inquiry
```json
{
  "name": "Bob Wilson",
  "email": "bob@example.com",
  "reason": "sales",
  "message": "I'm interested in your product"
}
```

## ✅ Expected Behavior

1. **Two emails will be sent:**
   - One to `CONTACT_EMAIL` (company notification)
   - One to the user's email (confirmation)

2. **Check both inboxes:**
   - Company email: "New [reason] from [name]"
   - User email: "Thank you for contacting Drag & Drop ERP"

3. **Check spam folder** if emails don't arrive

## 🐛 Troubleshooting

### Email Not Sending

1. **Check configuration:**
   ```bash
   curl http://localhost:5000/api/email/config
   ```

2. **Verify `.env` file:**
   - `EMAIL_USER` is set
   - `EMAIL_PASSWORD` is correct (App Password for Gmail)
   - `EMAIL_SERVICE` matches your provider

3. **Check server logs:**
   - Look for email errors in console
   - Check for authentication failures

### Gmail Specific Issues

- **"Less secure app access":** Use App Password instead
- **"Authentication failed":** Verify App Password is correct
- **"Rate limit exceeded":** Wait a few minutes and try again

### Common Errors

**Error: "Invalid login"**
- Solution: Check EMAIL_USER and EMAIL_PASSWORD

**Error: "Connection timeout"**
- Solution: Check internet connection and firewall

**Error: "Rate limit exceeded"**
- Solution: Wait 5-10 minutes before retrying

## 📝 Quick Test Command

```bash
# Test email with minimal data
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

This will use default values for all fields except email.

