import { User } from "@/models/UserModels";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const sendEmail = async ({ email, emailType, UserId }: any) => {
  try {
    const hashToken = await bcrypt.hash(UserId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(UserId, {
        $set :{
          verifyToken: hashToken,
          verifyTokenExpiry: Date.now() + 3600000,
        }
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(UserId, {
        $set: {
          forgotPasswordToken: hashToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        }
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_GMAIL,
        pass: process.env.NODEMAILER_GMAIL_PASS,
      },
    });
    const mailer = {
      from: `NextJS Auth <${process.env.NODEMAILER_GMAIL}>`,
      to: email,
      subject: emailType === "verify" ? "Verify Your Email" : "Verify Your Otp",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/VerifyEmail?token=${hashToken}">here</a> to ${
        emailType === "VERIFY" ? "Verify your email" : "reset your password"
      } or copy and paste the link below in your browswer <br /> ${
        process.env.DOMAIN
      }/VerifyEmail?token=${hashToken} </p>`,
    };
    const mail = await transporter.sendMail(mailer);
  } catch (error: any) {
    throw new Error(error);
  }
};

export { sendEmail };
