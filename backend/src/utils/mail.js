import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (options) => {
  const generateMail = new Mailgen({
    theme: "default",
    product: {
      name: "Book Bazaar",
      link: "https://mailgen.js/",
    },
  });

  /* Format of options parameter:
 options = {
    email: user.email,
    subject: "xyz",
    mailGenContent: emailVerificationMailGenContent(username, `url here`)
}
 */

  var emailBody = generateMail.generate(options.mailGenContent); //this mailGenContent will be a function (emailContent or passwordChange) and whatever will be the returned body that thing will get generated there , https://www.npmjs.com/package/mailgen
  var emailText = generateMail.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.HOST_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.HOST_USERNAME,
      pass: process.env.HOST_PASSWORD,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailText, //thing which we got above
    html: emailBody, // HTML body
  };

  try {
    await transporter.sendMail(mail);
  } catch (err) {
    console.error("Email failed", err);
  }
};

const emailContent = (username, url) => {
  return {
    body: {
      name: username,
      intro: "Welcome to App! We're very excited to have you on board.",
      action: {
        instructions: "To get started with our app, please click here:",
        button: {
          color: "#22BC66", // Color of the button
          text: "Verify your account",
          link: url, //this will be the link
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPassword = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Reset your password.",
      action: {
        instructions: "To change your password click here:",
        button: {
          color: "#22BC66", // Color of the button
          text: "Reset password",
          link: passwordResetUrl, //this will be the link
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { forgotPassword, emailContent, sendMail };
