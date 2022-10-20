import { Schema, model, models, Model } from "mongoose";

import { Currency } from "../currency";
import { OperationType, OrderClient, OrderStatus, OrderWallet } from "../utils";
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
  status: OrderStatus;
  client?: OrderClient;
  clientWallet?: OrderWallet;
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
      type: Schema.Types.Mixed
      // ref: "User"
    },
    clientWallet: {
      type: Schema.Types.Mixed
    },
    status: {
      type: String,
      enum: [
        OrderStatus.clientPersonalData,
        OrderStatus.clientWallet,
        OrderStatus.payment,
        OrderStatus.waiting,
        OrderStatus.confirmedByObserver,
        OrderStatus.closed
      ],
      required: true
    }
  },
  { timestamps: true }
);

const Order: Model<IOrder> = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
