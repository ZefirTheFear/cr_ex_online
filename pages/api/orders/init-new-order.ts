import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDB } from "../../../utils/ts/db";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return;
  }

  // const initOrderData = req.body as IRegisterData;
}
