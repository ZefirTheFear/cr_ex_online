import sendgrid, { MailDataRequired } from "@sendgrid/mail";

const message: MailDataRequired = {
  from: {
    name: "Cryptoobmin",
    email: "z4clr07.gaming@gmail.com"
  },
  to: {
    name: "user",
    email: "alexeyklimenkojs@gmail.com"
  },
  subject: "yurahh",
  content: [
    {
      type: "text/html",
      value: `<p>Hello, user!</p>`
    }
  ],
  replyTo: {
    email: "z4clr07.gaming@gmail.com"
  }
};

const sendEmail = async () => {
  try {
    if (process.env.SENDGRID_API_KEY) {
      console.log(process.env.SENDGRID_API_KEY);
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }
    const response = await sendgrid.send(message);
    console.log(response);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default sendEmail;
