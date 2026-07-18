const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOTPEmail(email, otp) {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);

    console.log('Sending OTP to:', email);

    console.log('OTP:', otp);
    await transporter.sendMail({
        from: `"Carb Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Carb Tracker OTP',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Verify your Carb Tracker account</h2>
                <p>Your OTP is:</p>

                <h1 style="letter-spacing: 8px;">
                    ${otp}
                </h1>

                <p>This OTP expires in 10 minutes.</p>
            </div>
        `
    });
}

module.exports = {
    sendOTPEmail
};