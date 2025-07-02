import nodemailer from "nodemailer";
import userOTPVerifyModel from "../models/UserOTPVerify.js";
import { Request, Response } from "express";

const sendOTPVerification = async (user: any) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const createOTP = await userOTPVerifyModel.create({
      userId: user._id,
      otp: otp,
      expiresAt: expiresAt,
    });

    return createOTP.otp;
  } catch (error) {
    console.error(error);
  }
};

const sendMail = async (req: Request, res: Response, otp: any = null) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.SENDERS_MAIL,
      pass: process.env.PASS,
    },
  });

  const currentDate = new Date().toLocaleDateString();

  if (otp) {
    const receiver = {
      from: process.env.SENDERS_MAIL,
      to: req.body.email,
      subject: "Thank You for Your Feedback! - HungryBox",
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HungryBox OTP Verification</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 0;">
          <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0px 0px 20px rgba(0,0,0,0.1);">
            <!-- Brand Header -->
            <tr>
              <td style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #eeeeee;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="text-align: center;">
                      <h1 style="display: inline-block; vertical-align: middle; margin: 0; color: #333333; font-size: 32px;">
                        <span style="color: #FF6B6B;">Hungry</span>Box
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- OTP Header -->
            <tr>
              <td style="background-color: #FF6B6B; padding: 30px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 28px;">Verify Your Email</h2>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px;">
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                  Dear ${req.body.name},
                </p>
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                  Thank you for choosing HungryBox. To complete your verification, please use the following OTP (One-Time Password):
                </p>
                
                <!-- OTP Box -->
                <table style="width: 100%; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #FF6B6B; background-color: #ffffff; padding: 15px; border-radius: 4px; display: inline-block; min-width: 160px;">
                        ${otp}
                      </div>
                      <p style="margin-top: 15px; color: #666666; font-size: 14px;">
                        This OTP will expire in 15 minutes
                      </p>
                    </td>
                  </tr>
                </table>
                
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                  If you didn't request this verification, please ignore this email or contact our support team if you have any concerns.
                </p>
                
                <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                  For security reasons, please do not share this OTP with anyone.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  © ${new Date().getFullYear()} HungryBox. All rights reserved.
                </p>
                <div style="margin-top: 15px;">
                  <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Website</a>
                  <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Contact Us</a>
                  <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html> 
      `,
    };

    try {
      await transporter.sendMail(receiver);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  } else {
    const receiver = {
      from: process.env.SENDERS_MAIL,
      to: req.body.email,
      subject: "Thank You for Your Feedback! - HungryBox",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>HungryBox Feedback Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0;">
                    <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0px 0px 20px rgba(0,0,0,0.1);">
                      <!-- Brand Header -->
                      <tr>
                        <td style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #eeeeee;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="text-align: center;">
                                <h1 style="display: inline-block; vertical-align: middle; margin: 0; color: #333333; font-size: 32px;">
                                  <span style="color: #FF6B6B;">Hungry</span>Box
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Feedback Header -->
                      <tr>
                        <td style="background-color: #FF6B6B; padding: 30px; text-align: center;">
                          <h2 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Your Feedback!</h2>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 30px;">
                          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                            Dear ${req.body.name},
                          </p>
                          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                            Thank you for taking the time to share your feedback with HungryBox. Your input helps us improve our tiffin services and provide a better experience for all our customers.
                          </p>
                          
                          <!-- Feedback Details -->
                          <table style="width: 100%; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 20px;">
                            <tr>
                              <td style="padding: 20px;">
                                <h3 style="margin-top: 0; color: #333333; margin-bottom: 15px;">Your Feedback Details:</h3>
                                <p style="margin: 5px 0; color: #666666;"><strong>Date:</strong> ${currentDate}</p>
                                <p style="margin: 5px 0; color: #666666;"><strong>Rating:</strong> ${Array(
                                  parseInt(req.body.rating)
                                )
                                  .fill("⭐")
                                  .join("")}</p>
                                <p style="margin: 5px 0; color: #666666;"><strong>Your Comments:</strong></p>
                                <p style="margin: 5px 0; color: #666666; background-color: #ffffff; padding: 15px; border-radius: 4px;">${
                                  req.body.feedback
                                }</p>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                            We value your opinion and are committed to continuously improving our services. If you have any additional feedback or questions, please don't hesitate to reach out to our customer support team.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                          <p style="margin: 0; color: #666666; font-size: 14px;">
                            © ${new Date().getFullYear()} HungryBox. All rights reserved.
                          </p>
                          <div style="margin-top: 15px;">
                            <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Website</a>
                            <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Contact Us</a>
                            <a href="#" style="color: #FF6B6B; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
    };

    try {
      await transporter.sendMail(receiver);
      return res
        .status(200)
        .json({ message: "Feedback received successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send feedback email" });
    }
  }
};

export { sendMail, sendOTPVerification };
