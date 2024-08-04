const path = require("path");
const transporter = require("../config/email");
const fs = require("fs");

exports.sendEmail = async ({ to, subject, verificationLink }) => {
  try {
    // Đọc file template HTML
    const templatePath = path.join(__dirname, "../views/email_template.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace("{{email}}", to);
    html = html.replace("{{verificationLink}}", verificationLink);

    // Cấu hình thông tin email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error sending mail: ", error);
    return false;
  }
};