import { Schema, model, models, Model, Types } from "mongoose";

import { IOrder } from "./order";

enum UserStatus {
  user = "user",
  observer = "observer",
  admin = "admin"
}

export interface IUser {
  // _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  status?: UserStatus;
  orders?: Types.DocumentArray<IOrder>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [UserStatus.user, UserStatus.observer, UserStatus.admin],
      required: true,
      default: UserStatus.user
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order"
      }
    ]
  },
  { timestamps: true }
);

// if (models.User) {
//   delete models.User
// }

// const User = model<IUser>("User", userSchema);
const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
export default User;
