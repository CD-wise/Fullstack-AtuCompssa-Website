# Contact Form Backend Integration Setup

The contact form is now connected to a backend API at `/api/contact`. To enable email sending, choose one of the following options:

## Option 1: Using Resend (Recommended for Next.js)

### Installation
```bash
npm install resend
```

### Setup
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:
```
RESEND_API_KEY=your_api_key_here
CONTACT_EMAIL=contact@yourdepartment.edu
```

### Implementation
In `app/api/contact/route.ts`, uncomment the Resend section and use:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: process.env.CONTACT_EMAIL || 'contact@department.edu',
  replyTo: email,
  subject: `New Contact Form: ${subject}`,
  html: `...`
})
```

---

## Option 2: Using SendGrid

### Installation
```bash
npm install @sendgrid/mail
```

### Setup
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`:
```
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=contact@yourdepartment.edu
```

### Implementation
In `app/api/contact/route.ts`, uncomment the SendGrid section.

---

## Option 3: Using Nodemailer (Gmail/Other SMTP)

### Installation
```bash
npm install nodemailer
```

### Setup for Gmail
1. Enable 2-factor authentication on your Google account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Add to `.env.local`:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your_app_password_here
CONTACT_EMAIL=contact@yourdepartment.edu
```

### Implementation
In `app/api/contact/route.ts`, uncomment the Nodemailer section.

---

## Testing the Form

Once you've set up your email provider:

1. Start the dev server:
```bash
npm run dev
```

2. Go to `http://localhost:3000` and scroll to the "Get in Touch" section
3. Fill out the form and submit
4. Check that the email arrives at your configured contact email

---

## Current API Endpoint

- **URL**: `/api/contact`
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about programs",
  "message": "I would like to know more about..."
}
```

- **Response (Success)**:
```json
{
  "message": "Email sent successfully"
}
```

- **Response (Error)**:
```json
{
  "error": "Error description"
}
```

## Features

✅ Email validation
✅ Required field validation
✅ Message length validation
✅ Error handling
✅ Form reset on success
✅ Loading states
✅ Success/error messages

## Customization

To customize the email template, edit the `html` property in `app/api/contact/route.ts`. You can add CSS styling, branding, or additional information as needed.
