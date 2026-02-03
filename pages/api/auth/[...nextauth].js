import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const client = await connectToDatabase();
                    const usersCollection = client.db().collection("users");

                    const user = await usersCollection.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        client.close();
                        throw new Error("No user found!");
                    }

                    const isValid = await verifyPassword(
                        credentials.password,
                        user.password,
                    );

                    if (!isValid) {
                        client.close();
                        throw new Error("Could not log you in!");
                    }

                    client.close();
                    return { email: user.email };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.email) {
                session.user.email = token.email;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
