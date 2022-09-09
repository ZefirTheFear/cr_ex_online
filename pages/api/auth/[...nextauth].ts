import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { loginValidation, ILoginData } from "../../../utils/ts/validations";
import { connectToDB } from "../../../utils/ts/db";
import User from "../../../models/user";
import { LoginInputErrorType } from "../../../components/LoginForm/LoginForm";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
  },

  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {}, language: {} },

      async authorize(loginData) {
        if (!loginData) {
          return null;
        }

        const loginInputErrors = loginValidation(loginData as ILoginData);
        if (loginInputErrors) {
          throw new Error("no no no");
        }

        const connection = await connectToDB();
        if (!connection) {
          throw new Error(LoginInputErrorType.db);
        }

        const user = await User.findOne({ email: loginData.email.toLocaleLowerCase() });
        if (!user) {
          connection.connection.close();
          throw new Error(LoginInputErrorType.email);
        }

        const isValidPassword = await compare(loginData.password, user.password);
        if (!isValidPassword) {
          connection.connection.close();
          throw new Error(LoginInputErrorType.password);
        }

        connection.connection.close();
        return { email: user.email };
      }
    })
  ]
};

export default NextAuth(authOptions);
