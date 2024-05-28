const nodemailer = require("nodemailer");
const ejs = require('ejs')
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 25,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     secure: true,
  //     auth:{
  //         user : process.env.EMAIL_USERNAME,
  //         pass : process.env.EMAIL_PASSWORD,
  //     }
  //  });
    const source = await ejs.renderFile(__dirname + template, payload)

    const options ={
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: source,
    };
    // Send email
    transporter.sendMail(options, (error, info) => {
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });

  } catch (error) {
    return error;
  }
};

module.exports = {
    sendEmail
}