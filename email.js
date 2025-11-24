import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

// Professional email templates with ERP Contact branding and logo
const createCompanyNotificationTemplate = ({ name, email, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request - ERP Contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 40px; text-align: center;">
            <img src="https://draganddrop.in/ddfinal.png" alt="ERP Contact Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; border: 3px solid #ffffff;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🔔 New Contact Request</h1>
            <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">ERP Contact - Professional Solutions</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">📋 Contact Details</h2>

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
                <img src="https://draganddrop.in/ddfinal.png" alt="ERP Contact" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">
                <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 16px; font-weight: 600;">ERP Contact</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    Professional ERP Solutions for Your Business<br>
                    <a href="https://draganddrop.in" style="color: #3b82f6; text-decoration: none;">www.draganddrop.in</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

const createUserThankYouTemplate = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting ERP Contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 40px; text-align: center;">
            <img src="https://draganddrop.in/ddfinal.png" alt="ERP Contact Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; border: 3px solid #ffffff;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🙏 Thank You for Reaching Out</h1>
            <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">ERP Contact - Professional Solutions</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px; margin-bottom: 20px;">📬</div>
                <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Message Received!</h2>
                <p style="color: #64748b; font-size: 16px; margin: 0;">Hi ${name}, we've received your message and appreciate your interest in ERP Contact!</p>
            </div>

            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                <h3 style="color: #0f172a; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">🚀 What happens next?</h3>

                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">1</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Review your inquiry</div>
                        <div style="color: #64748b; font-size: 14px;">Our team will carefully review your message within 24 hours</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">2</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Contact you back</div>
                        <div style="color: #64748b; font-size: 14px;">We'll respond with solutions tailored to your needs</div>
                    </div>
                </div>

                <div style="display: flex; align-items: center;">
                    <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 15px;">3</div>
                    <div>
                        <div style="font-weight: 600; color: #0f172a;">Discuss your needs</div>
                        <div style="color: #64748b; font-size: 14px;">Help you find the perfect ERP solution for your business</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <img src="https://draganddrop.in/ddfinal.png" alt="ERP Contact" style="width: 40px; height: 40px; border-radius: 50%; margin-bottom: 10px;">
                <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 16px; font-weight: 600;">Questions? Contact ERP Contact directly</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    Email: <a href="mailto:dragdroperp@gmail.com" style="color: #3b82f6; text-decoration: none;">dragdroperp@gmail.com</a><br>
                    Website: <a href="https://draganddrop.in" style="color: #3b82f6; text-decoration: none;">www.draganddrop.in</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 20px; text-align: center;">
            <img src="https://draganddrop.in/ddfinal.png" alt="ERP Contact" style="width: 40px; height: 40px; border-radius: 50%; margin-bottom: 10px; border: 2px solid #ffffff;">
            <p style="margin: 0 0 5px 0; color: #cbd5e1; font-size: 16px; font-weight: 600;">ERP Contact</p>
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
 * Sends both company notification and user thank-you emails with professional branding
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
    console.log('📧 [PRODUCTION] Sending contact emails via Resend API...')
    console.log('   User:', name, '<' + email + '>')
    console.log('   Message length:', message.length, 'characters')
    console.log('   Timestamp:', new Date().toISOString())

    let companyEmailResult = null
    let userEmailResult = null
    let errors = []

    // Use resend.dev for testing (verified domains may fail if not set up)
    const useVerifiedDomain = process.env.USE_VERIFIED_DOMAIN === 'true' // Default to false for testing
    const senderEmail = useVerifiedDomain ? 'noreply@draganddrop.in' : 'noreply@resend.dev'

    console.log('   📧 Using sender domain:', senderEmail)
    console.log('   📧 Domain verification:', useVerifiedDomain ? 'ENABLED (draganddrop.in)' : 'DISABLED (resend.dev)')

    if (useVerifiedDomain) {
      console.log('   ⚠️  IMPORTANT: Ensure draganddrop.in is verified in Resend dashboard')
      console.log('      If emails fail, set USE_VERIFIED_DOMAIN=false to use resend.dev fallback')
    }

    // Send notification email to company
    try {
      console.log('   📤 Sending notification to company...')
      console.log('      From: ERP Contact <' + senderEmail + '>')
      console.log('      To: dragdroperp@gmail.com')

      const companyResult = await resend.emails.send({
        from: `ERP Contact <${senderEmail}>`,
        to: ['dragdroperp@gmail.com'],
        subject: 'New Contact Request - ERP Contact',
        html: createCompanyNotificationTemplate({ name, email, message }),
      })

      // Check if there was an error in the response
      if (companyResult.error) {
        throw new Error(`Resend API error: ${companyResult.error.message}`)
      }

      companyEmailResult = companyResult.data?.id || companyResult.id || 'sent'
      console.log('   ✅ Company notification sent successfully:', companyEmailResult)
    } catch (companyError) {
      console.error('   ❌ Company notification failed:', companyError.message)
      errors.push('Company notification: ' + companyError.message)
    }

    // Send thank-you email to user (always attempt, even if company email failed)
    try {
      console.log('   📤 Sending thank-you to user...')
      console.log('      From: ERP Contact <' + senderEmail + '>')
      console.log('      To:', email)
      console.log('      Note: If this goes to spam, user should check spam folder')

      const userResult = await resend.emails.send({
        from: `ERP Contact <${senderEmail}>`,
        to: [email],
        subject: 'Thank You for Contacting ERP Contact',
        html: createUserThankYouTemplate({ name }),
      })

      // Check if there was an error in the response
      if (userResult.error) {
        console.warn('   ⚠️ User email API error (but continuing):', userResult.error.message)
        userEmailResult = null // Mark as failed but continue
      } else {
        userEmailResult = userResult.data?.id || userResult.id || 'sent'
        console.log('   ✅ Thank-you email sent successfully:', userEmailResult)
        console.log('   📧 User should check inbox AND spam folder')
      }

    } catch (userError) {
      console.error('   ❌ Thank-you email failed:', userError.message)
      console.error('   📧 This might be due to:')
      console.error('      - Email going to spam (most common)')
      console.error('      - Domain reputation issues')
      console.error('      - User email server filtering')

      errors.push('Thank-you email: ' + userError.message)
    }

    // For production: prioritize company notification
    // If company email failed, this is critical - throw error
    if (!companyEmailResult) {
      throw new Error('Unable to send company notification. Please try again later.')
    }

    // User thank-you email failure is logged but doesn't fail the request
    if (!userEmailResult) {
      console.warn('⚠️  [PRODUCTION] Thank-you email failed, but company notification sent')
      console.warn('   Possible reasons:')
      console.warn('   - Email going to spam folder')
      console.warn('   - Domain reputation issues')
      console.warn('   - User email address issues')
      console.warn('   - Check spam folder and email filters')
      if (errors.length > 0) {
        console.warn('   Errors:', errors.join(', '))
      }
    } else {
      console.log('🎉 [PRODUCTION] Both emails sent successfully!')
      console.log('   📧 Company notification: Sent')
      console.log('   🙏 User thank-you: Sent')
    }

    return {
      companyEmail: companyEmailResult,
      userEmail: userEmailResult,
      success: true,
      partialSuccess: errors.length > 0
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
