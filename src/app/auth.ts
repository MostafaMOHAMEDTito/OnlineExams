import { JSON_HEADER } from "./../lib/constants/api.constants";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const OPTIONS: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email Address",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      async authorize(credentials, req) {
        const baseURL = process.env.API + "/auth/signin";

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required.");
        }

        try {
          const res = await fetch(baseURL, {
            method: "POST",
            headers: { ...JSON_HEADER },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.log("API Error Data:", errorData); // Log the error data
            throw new Error(errorData.message || "Authentication failed.");
          }

          const data = await res.json();

          // Return the user object with token and other details
          return {
            ...data.user,
            token: data.token,
            message: data.message,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.message = user.message;
        token.token = user.token;
        token._id = user._id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ token, session }) {
      session.message = token.message;
      session._id = token._id;
      session.username = token.username;
      session.firstName = token.firstName;
      session.lastName = token.lastName;
      session.email = token.email;
      session.phone = token.phone;
      session.role = token.role;
      session.isVerified = token.isVerified;
      session.createdAt = token.createdAt;
      session.token = token.token;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
