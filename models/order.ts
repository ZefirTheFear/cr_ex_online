import { Schema, model, models, Model, Types } from "mongoose";

import { Currency } from "./currency";
// import { IUser } from "./user";

enum OrderStatus {
  init = "init",
  withFullData = "withFullData",
  confirmedByUser = "confirmedByUser",
  confirmedByObserver = "confirmedByObserver",
  closed = "closed"
}

enum OrderType {
  cryptoToFiat = "cryptoToFiat",
  fiatToCrypto = "fiatToCrypto",
  cryptoToCrypto = "cryptoToCrypto"
}

export interface IOrder {
  // _id?: Types.ObjectId;
  // client: IUser["_id"];
  initData: {
    currencyFromCustomer: Currency;
    amountFromCustomer: number;
    currencyToCustomer: Currency;
    amountToCustomer: number;
  };
  type: OrderType;
  client?: Types.ObjectId;
  status?: OrderStatus;
}

const orderSchema = new Schema<IOrder>(
  {
    initData: {
      type: Schema.Types.Mixed,
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
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
