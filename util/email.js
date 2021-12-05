import nodemailer from 'nodemailer';

export const sendEmail = async options => {
    //  Create nodemailer sender
    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
         user: process.env.EMAIL_USERNAME,
         pass: process.env.EMAIL_PASSWORD,
        }

    });

    const mailOptions = {
        from: 'Mohd Saifuddin <mohdsaifuddin9794@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    transporter.sendMail(mailOptions)
}
