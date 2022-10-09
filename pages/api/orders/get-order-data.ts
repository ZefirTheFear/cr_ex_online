import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDB } from "../../../utils/ts/db";
import Order, { IOrder } from "../../../models/mongooseSchemas/order";

type Data =
  | {
      message: string;
    }
  | { orderData: IOrder };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    return;
  }

  const orderId = req.headers["order-id"];
  if (!orderId) {
    return res.status(503).json({ message: "no order-id" });
  }

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) {
    connection.connection.close();
    return res.status(503).json({ message: "cant find order" });
  }

  connection.connection.close();

  return res.status(200).json({ orderData: existingOrder });
}
