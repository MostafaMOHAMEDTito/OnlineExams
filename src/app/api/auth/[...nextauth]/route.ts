import { OPTIONS } from "@/app/auth";
import NextAuth from "next-auth";



const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
