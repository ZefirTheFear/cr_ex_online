import { Schema, model, models, Model, Types } from "mongoose";

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
  // initData: {},
  // _id?: Types.ObjectId;
  // client: IUser["_id"];
  client: Types.ObjectId;
  status: OrderStatus;
  type: OrderType;
}

const orderSchema = new Schema<IOrder>(
  {
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
