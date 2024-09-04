const path = require("path");
const transporter = require("../config/email");
const fs = require("fs");
const ejs = require("ejs");
const { formatMoney } = require("../utils/money");
const { EMAIL_USER } = require("../config/config");

exports.sendVerificationMail = async ({ to, subject, verificationLink }) => {
  try {
    // Đọc file template HTML
    const templatePath = path.join(__dirname, "../views/email_template.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace("{{email}}", to);
    html = html.replace("{{verificationLink}}", verificationLink);

    // Cấu hình thông tin email
    const mailOptions = {
      from: EMAIL_USER,
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

exports.sendOrderSummaryMail = async ({ to, subject, orders, totalAmount }) => {
  try {
    // Đọc template HTML
    const templatePath = path.join(__dirname, "../views/order_template.html");
    let template = fs.readFileSync(templatePath, "utf8");

    const html = ejs.render(template, {
      email: to,
      orders,
      totalAmount: formatMoney(totalAmount || 0),
    });

    // Cấu hình thông tin email
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    return false;
  }
};
