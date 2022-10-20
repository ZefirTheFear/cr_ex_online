import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";

import { connectToDB } from "../../../utils/ts/db";
import Order, { IOrder } from "../../../models/mongooseSchemas/order";
import { OrderClient, OrderStatus } from "../../../models/utils";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "PUT") {
    return;
  }

  const orderId = req.headers["order-id"] as string;
  if (!orderId) {
    return res.status(503).json({ message: "no order-id" });
  }

  const isValidId = Types.ObjectId.isValid(orderId);
  if (!isValidId) {
    console.log("really?");
    return res.status(404).json({ message: "really?" });
  }

  const clientData = req.body as OrderClient;

  const connection = await connectToDB();
  if (!connection) {
    return res.status(503).json({ message: "connecting db error" });
  }

  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) {
    console.log("cant find order");
    connection.connection.close();
    return res.status(404).json({ message: "cant find order" });
  }

  existingOrder.client = clientData;
  existingOrder.status = OrderStatus.clientWallet;

  try {
    await existingOrder.save();
  } catch (error) {
    connection.connection.close();
    return res.status(503).json({ message: "oops. order updating problem" });
  }

  connection.connection.close();

  return res.status(200).json({ message: "success" });
}
