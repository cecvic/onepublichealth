// Simple serverless function to handle signup email notifications
// This would typically be deployed to Vercel, Netlify, or similar platform

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, adminEmail } = req.body;

    // Validate required fields
    if (!name || !email || !adminEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For demo purposes, we'll simulate sending an email
    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log('New signup notification:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would send the email here
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: adminEmail,
      from: 'noreply@yourdomain.com',
      subject: 'New Community Signup',
      html: `
        <h2>New Community Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Signed up at:</strong> ${new Date().toLocaleString()}</p>
      `,
    };
    
    await sgMail.send(msg);
    */

    return res.status(200).json({ 
      success: true, 
      message: 'Signup notification sent successfully' 
    });

  } catch (error) {
    console.error('Error sending signup email:', error);
    return res.status(500).json({ 
      error: 'Failed to send signup notification' 
    });
  }
}
