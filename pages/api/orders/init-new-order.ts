import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDB } from "../../../utils/ts/db";
import Order, { IOrder } from "../../../models/mongooseSchemas/order";
import { IOrderInitData } from "./../../../utils/ts/validations";
import { defineOperationType } from "../../../utils/ts/defineOperationType";

type Data =
  | {
      message: string;
    }
  | {
      orderId: string;
    };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return;
  }

  const initOrderData = req.body as IOrderInitData;

  // TODO Validaion

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const operationType = defineOperationType({
    currencyFromCustomer: initOrderData.currencyFromCustomer,
    currencyToCustomer: initOrderData.currencyToCustomer
  });

  return res.status(201).json({ message: `operationType: ${operationType}` });

  // const newOrder = new Order<IOrder>({
  //   initData:initOrderData,
  //   type:
  // })
}
