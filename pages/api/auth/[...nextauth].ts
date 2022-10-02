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
    maxAge: 30 * 24 * 60 * 60
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
        return {
          email: user.email,
          name: user.name,
          phone: user.phone
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("jwt_token: ", token);
      // console.log("jwt_user: ", user);
      // console.log("jwt_account: ", account);
      // console.log("jwt_profile: ", profile);
      // console.log("jwt_isNewUser: ", isNewUser);
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // console.log("ses_session: ", session);
      // console.log("ses_token: ", token);
      // console.log("ses_user: ", user);
      return {
        ...session,
        user: { name: token.name, email: token.email, phone: token.phone }
      };
    }
  }
  // events: {
  //   async session({ session, token }) {
  //     console.log("ev_ses_session: ", session);
  //     console.log("ev_ses_token: ", token);
  //   }
  // }
};

export default NextAuth(authOptions);
