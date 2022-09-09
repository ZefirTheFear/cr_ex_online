import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";

import { connectToDB } from "../../../utils/ts/db";
import User, { IUser } from "../../../models/user";
import { Languages } from "../../../models/language";
import {
  registerValidation,
  IRegisterData,
  IRegisterInputErrors
} from "../../../utils/ts/validations";
// import sendEmail from "../../utils/ts/send-email";

type Data =
  | {
      message: string;
    }
  | { inputErrors: IRegisterInputErrors };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return;
  }

  const registerData = req.body as IRegisterData;

  const registerInputErrors = registerValidation(registerData);
  if (registerInputErrors) {
    return res.status(422).json({ inputErrors: registerInputErrors });
  }

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingUser = await User.findOne({ email: registerData.email.toLowerCase() });
  if (existingUser) {
    connection.connection.close();
    return res.status(422).json({
      inputErrors: {
        email: [
          registerData.language === Languages.en
            ? "this email is already registered"
            : registerData.language === Languages.ua
            ? "такий email вже зареєстрований"
            : "такой email уже зарегистрирован"
        ]
      }
    });
  }

  const hashedPassword = await hash(registerData.password, 12);

  const newUser = new User<IUser>({
    name: registerData.name.trim(),
    email: registerData.email.toLocaleLowerCase().trim(),
    phone: registerData.phone.trim(),
    password: hashedPassword
  });
  try {
    await newUser.save();
  } catch (error) {
    console.log("error: ", error);
    connection.connection.close();
    return res.status(503).json({ message: "oops. user creating problem" });
  }

  // ---------------------
  // await sendEmail();
  // return res.status(200).json({ message: "success" });
  // ---------------------

  connection.connection.close();
  return res.status(200).json({ message: "success" });
}
