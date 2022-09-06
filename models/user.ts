import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const userSchema = new Schema<IUser>({
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
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export default models.User || model<IUser>("User", userSchema);
