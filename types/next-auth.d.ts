// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Session, DefaultSession, User } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      name: string;
      email: string;
      phone: string;
    };
  }

  interface User {
    name: string;
    email: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    email: string;
    phone: string;
  }
}