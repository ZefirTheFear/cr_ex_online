import type { NextApiRequest, NextApiResponse } from "next";

import {
  editUserDataValidation,
  IEditUserData,
  IEditUserInputErrors
} from "../../../utils/ts/validations";
import { connectToDB } from "../../../utils/ts/db";
import User from "../../../models/user";

type Data =
  | {
      message: string;
    }
  | { inputErrors: IEditUserInputErrors };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "PATCH") {
    return;
  }

  const editUserNameData = req.body as IEditUserData;

  if (!editUserNameData.currentEmail || !editUserNameData.newName) {
    return;
  }

  const editUserNameInputErrors = editUserDataValidation(editUserNameData);
  if (editUserNameInputErrors) {
    return res.status(422).json({ inputErrors: editUserNameInputErrors });
  }

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingUser = await User.findOne({ email: editUserNameData.currentEmail });
  if (!existingUser) {
    connection.connection.close();
    return res.status(503).json({ message: "cant find user" });
  }

  existingUser.name = editUserNameData.newName;

  try {
    await existingUser.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. user updating problem" });
  }

  connection.connection.close();

  return res.status(200).json({ message: "success" });
}
