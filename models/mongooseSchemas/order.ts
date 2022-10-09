import { Schema, model, models, Model, Types } from "mongoose";

import { Currency } from "../currency";
import { OperationType, OrderStatus } from "../utils";
// import { IUser } from "./user";

export interface IOrder {
  // _id?: Types.ObjectId;
  // client: IUser["_id"];
  initData: {
    currencyFromCustomer: Currency;
    amountFromCustomer: number;
    currencyToCustomer: Currency;
    amountToCustomer: number;
  };
  type: OperationType;
  client?: Types.ObjectId;
  status?: OrderStatus;
}

const orderSchema = new Schema<IOrder>(
  {
    initData: {
      type: Schema.Types.Mixed,
      required: true
    },
    type: {
      type: String,
      enum: [OperationType.cryptoToCrypto, OperationType.cryptoToFiat, OperationType.fiatToCrypto],
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: [
        OrderStatus.init,
        OrderStatus.withFullData,
        OrderStatus.confirmedByUser,
        OrderStatus.confirmedByObserver,
        OrderStatus.closed
      ],
      required: true,
      default: OrderStatus.init
    }
  },
  { timestamps: true }
);

const Order: Model<IOrder> = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
