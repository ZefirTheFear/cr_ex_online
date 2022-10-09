import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";

import { connectToDB } from "../../../utils/ts/db";
import User from "../../../models/mongooseSchemas/user";
import {
  forgotPasswordValidation,
  IForgotPasswordData,
  IForgotPasswordInputErrors
} from "../../../utils/ts/validations";
import { Languages } from "../../../models/language";
import sendEmail from "../../../utils/ts/sendEmail";

type Data =
  | {
      message: string;
    }
  | { inputErrors: IForgotPasswordInputErrors };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return;
  }

  const forgotPasswordData = req.body as IForgotPasswordData;

  const forgotPasswordInputErrors = forgotPasswordValidation(forgotPasswordData);
  if (forgotPasswordInputErrors) {
    return res.status(422).json({ inputErrors: forgotPasswordInputErrors });
  }

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingUser = await User.findOne({ email: forgotPasswordData.email });
  if (!existingUser) {
    connection.connection.close();
    return res.status(422).json({
      inputErrors: {
        email: [
          forgotPasswordData.language === Languages.en
            ? "this email is not registered"
            : forgotPasswordData.language === Languages.ua
            ? "такий email не зареєстрований"
            : "такой email не зарегистрирован"
        ]
      }
    });
  }

  const newPassword = `NP${uuid().slice(0, 8)}`;
  const hashedPassword = await hash(newPassword, 12);
  existingUser.password = hashedPassword;

  try {
    await existingUser.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. user updating problem" });
  }

  connection.connection.close();

  const emailTemplate = `
  <p>
  ${
    forgotPasswordData.language === Languages.en
      ? "Hello "
      : forgotPasswordData.language === Languages.ua
      ? "Вітаємо, "
      : "Здравствуйте, "
  }${existingUser.name}
  </p>
  <p>
  ${
    forgotPasswordData.language === Languages.en
      ? "Your new password is:"
      : forgotPasswordData.language === Languages.ua
      ? "Ваш новий пароль:"
      : "Ваш новый пароль:"
  }</p>
  <p>
  ${newPassword}
  </p>
  `;

  const sendingEmailResult = await sendEmail(
    existingUser,
    forgotPasswordData.language === Languages.en
      ? "New password on Cryptoobmin"
      : forgotPasswordData.language === Languages.ua
      ? "Новий пароль на Cryptoobmin"
      : "Новый пароль на Cryptoobmin",
    emailTemplate
  );
  if (!sendingEmailResult) {
    return res.status(503).json({ message: "cant send u email" });
  }

  return res.status(200).json({ message: "success" });
}
