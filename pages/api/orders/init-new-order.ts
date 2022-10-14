import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDB } from "../../../utils/ts/db";
import Order, { IOrder } from "../../../models/mongooseSchemas/order";
import { IOrderInitData } from "./../../../utils/ts/validations";
// import { OperationType } from "./../../../models/utils";
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
  if (!operationType) {
    return res.status(503).json({ message: "operation type is undefined" });
  }

  const newOrder = new Order<IOrder>({
    initData: {
      currencyFromCustomer: initOrderData.currencyFromCustomer,
      amountFromCustomer: +initOrderData.amountCurrencyFromCustomer,
      currencyToCustomer: initOrderData.currencyToCustomer,
      amountToCustomer: +initOrderData.amountCurrencyToCustomer
    },
    type: operationType
  });
  try {
    await newOrder.save();
  } catch (error) {
    console.log("error: ", error);
    connection.connection.close();
    return res.status(503).json({ message: "oops. order creating problem" });
  }

  connection.connection.close();

  return res.status(200).json({ orderId: newOrder._id.toString() });
}
