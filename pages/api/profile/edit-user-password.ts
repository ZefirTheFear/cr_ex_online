import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { compare, hash } from "bcryptjs";

import { authOptions } from "../auth/[...nextauth]";
import {
  editUserDataValidation,
  IEditUserData,
  IEditUserInputErrors
} from "../../../utils/ts/validations";
import { connectToDB } from "../../../utils/ts/db";
import User from "../../../models/mongooseSchemas/user";
import { Languages } from "../../../models/language";

type Data =
  | {
      message: string;
    }
  | { inputErrors: IEditUserInputErrors };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userId = session.user.id;

  const editUserData = req.body as IEditUserData;

  if (!userId || !editUserData.currentPassword || !editUserData.newPassword) {
    res.status(401).json({ message: "No data!" });
    return;
  }

  const inputErrors = editUserDataValidation(editUserData);
  if (inputErrors) {
    return res.status(422).json({ inputErrors: inputErrors });
  }

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    connection.connection.close();
    return res.status(503).json({ message: "cant find user" });
  }

  const isValidPassword = await compare(editUserData.currentPassword, existingUser.password);
  if (!isValidPassword) {
    connection.connection.close();
    return res.status(422).json({
      inputErrors: {
        currentPassword: [
          editUserData.language === Languages.en
            ? "wrong password"
            : editUserData.language === Languages.ua
            ? "неправильний пароль"
            : "неправильный пароль"
        ]
      }
    });
  }

  const hashedNewPassword = await hash(editUserData.newPassword, 12);

  existingUser.password = hashedNewPassword;

  try {
    await existingUser.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. user updating problem" });
  }

  connection.connection.close();

  return res.status(200).json({ message: "success" });
}
