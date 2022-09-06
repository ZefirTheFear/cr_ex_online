import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDB } from "../../utils/ts/db";
import User, { IUser } from "./../../models/user";

import {
  registerValidation,
  IRegisterData,
  IRegisterInputErrors
} from "./../../utils/ts/validations";

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

  // проверить на существующего пользователя
  // захэшить пароль

  const newUser = new User<IUser>({
    name: registerData.name,
    email: registerData.email,
    phone: registerData.phone,
    password: registerData.password
  });
  let savedUser: IUser;
  try {
    savedUser = await newUser.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. user creating problem" });
  }

  connection.connection.close();
  return res.status(200).json({ message: "success" });
}
