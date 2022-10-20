// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Session, DefaultSession, User } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { Types } from "mongoose";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: Types.ObjectId;
      name: string;
      email: string;
      phone: string;
    };
  }

  interface User {
    id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
  }
}
