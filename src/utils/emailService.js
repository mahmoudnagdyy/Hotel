import nodemailer from 'nodemailer'


export const sendEmail = async ({from=process.env.EMAIL, to, cc, bcc, text, subject, html, attachments=[]} = {}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });


    const info = await transporter.sendMail({
        from: `"Hotel" <${from}>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments
    });

}