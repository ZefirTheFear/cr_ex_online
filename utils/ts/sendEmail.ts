import sendgrid, { MailDataRequired } from "@sendgrid/mail";

import { IUser } from "../../models/mongooseSchemas/user";

const sendEmail = async (user: IUser, subject: string, htmlTemplate: string) => {
  if (!process.env.SENDGRID_EMAIL || !process.env.SENDGRID_API_KEY) {
    return;
  }

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const mailData: MailDataRequired = {
    from: {
      name: "Cryptoobmin",
      email: process.env.SENDGRID_EMAIL
    },
    to: {
      name: user.name,
      email: user.email
    },
    subject: subject,
    content: [
      {
        type: "text/html",
        value: htmlTemplate
      }
    ],
    replyTo: {
      email: process.env.SENDGRID_EMAIL
    }
  };

  try {
    const response = await sendgrid.send(mailData);
    console.log("sendgrid response: ", response);
    return response;
  } catch (error) {
    console.log("sendgrid error: ", error);
    return;
  }
};

export default sendEmail;
