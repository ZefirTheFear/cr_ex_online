import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import {
  editUserDataValidation,
  IEditUserData,
  IEditUserInputErrors
} from "../../../utils/ts/validations";
import { connectToDB } from "../../../utils/ts/db";
import User from "../../../models/mongooseSchemas/user";

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

  if (!userId || !editUserData.newPhone) {
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

  existingUser.phone = editUserData.newPhone;

  try {
    await existingUser.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. user updating problem" });
  }

  connection.connection.close();

  return res.status(200).json({ message: "success" });
}
