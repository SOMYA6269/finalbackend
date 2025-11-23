import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

// Professional email templates for ERP Contact
const createContactNotificationTemplate = ({ name, email, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🔔 New Contact Request</h1>
            <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">ERP Contact Form Submission</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Contact Details</h2>

                <div style="margin-bottom: 20px;">
                    <div style="display: inline-block; background: #0f172a; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-bottom: 8px;">👤 NAME</div>
                    <div style="font-size: 18px; font-weight: 600; color: #0f172a; margin-left: 8px;">${name}</div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: inline-block; background: #0f172a; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-bottom: 8px;">📧 EMAIL</div>
                    <div style="font-size: 18px; font-weight: 600; color: #0f172a; margin-left: 8px;">
                        <a href="mailto:${email}" style="color: #0f172a; text-decoration: none; border-bottom: 2px solid #3b82f6;">${email}</a>
                    </div>
                </div>

                <div>
                    <div style="display: inline-block; background: #0f172a; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-bottom: 8px;">💬 MESSAGE</div>
                    <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-left: 8px; font-size: 16px; line-height: 1.6; color: #374151; white-space: pre-line;">
                        ${message}
                    </div>
                </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    This message was sent from your ERP Contact website form
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const createThankYouTemplate = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🙏 Thank You for Reaching Out</h1>
            <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">We appreciate your interest in ERP Contact</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px; margin-bottom: 20px;">📬</div>
                <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Message Received!</h2>
                <p style="color: #64748b; font-size: 16px; margin: 0;">Hi ${name}, we've received your message</p>
            </div>

            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <h3 style="color: #0f172a; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">What happens next?</h3>

                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">1</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Review your inquiry</div>
                        <div style="color: #64748b; font-size: 14px;">Our team will carefully review your message</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">2</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Contact you back</div>
                        <div style="color: #64748b; font-size: 14px;">We'll respond within 24-48 hours</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">3</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Discuss your needs</div>
                        <div style="color: #64748b; font-size: 14px;">Help you find the perfect ERP solution</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Questions? Contact us directly</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    Email: <a href="mailto:contact@erpcompany.com" style="color: #3b82f6; text-decoration: none;">contact@erpcompany.com</a><br>
                    Phone: <a href="tel:+1234567890" style="color: #3b82f6; text-decoration: none;">+1 (234) 567-8900</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
                © 2024 ERP Contact. All rights reserved.<br>
                <span style="font-size: 12px;">Empowering businesses with innovative ERP solutions</span>
            </p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Send contact emails using Resend API
 * Sends both a notification to the company and a thank-you to the user
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.message - Contact message
 */
export async function sendContactEmail({ name, email, message }) {
  // Get API key from environment
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ RESEND_API_KEY environment variable is not set')
    throw new Error('Resend API key is not configured')
  }

  // Initialize Resend client
  const resend = new Resend(apiKey.trim())

  try {
    console.log('📧 Sending contact emails via Resend API...')

    // Send notification email to company
    console.log('   📤 Sending notification to company...')
    console.log('      From: ERP Contact <noreply@mydomain.com>')
    console.log('      To: dragdroperp@gmail.com')
    console.log('      Subject: New contact request')

    const companyResult = await resend.emails.send({
      from: 'ERP Contact <noreply@mydomain.com>',
      to: ['dragdroperp@gmail.com'],
      subject: 'New Contact Request - ERP Contact',
      html: createContactNotificationTemplate({ name, email, message }),
    })

    console.log('   ✅ Company notification sent:', companyResult.data?.id)

    // Send thank-you email to user
    console.log('   📤 Sending thank-you to user...')
    console.log('      From: ERP Contact <noreply@mydomain.com>')
    console.log('      To:', email)
    console.log('      Subject: Thank you for contacting ERP Contact')

    const userResult = await resend.emails.send({
      from: 'ERP Contact <noreply@mydomain.com>',
      to: [email],
      subject: 'Thank You for Contacting ERP Contact',
      html: createThankYouTemplate({ name }),
    })

    console.log('   ✅ Thank-you email sent:', userResult.data?.id)

    return {
      companyEmail: companyResult.data?.id,
      userEmail: userResult.data?.id
    }

  } catch (error) {
    console.error('❌ Resend email sending error:')
    console.error('   Message:', error.message)
    console.error('   Status Code:', error.statusCode)
    console.error('   Response:', error.response?.body)

    // Provide more specific error messages
    if (error.statusCode === 401) {
      throw new Error('Resend API authentication failed. Please check your RESEND_API_KEY.')
    } else if (error.statusCode === 403) {
      throw new Error('Resend API access forbidden. Please check your API key permissions.')
    } else if (error.statusCode === 400) {
      throw new Error('Invalid email request. Please check the email format and content.')
    } else {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
