import NextAuth, { type AuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { users, incidents, secretCodes } from "@/db/schema";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const user = await db.select().from(users).where(eq(users.email, credentials.email)).then(res => res[0])

                if (!user || user.role == "Handler") return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!passwordMatch) return null;

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
        CredentialsProvider({
            id: "handler-access",
            name: "Handler Access",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const user = await db.select().from(users).where(eq(users.email, credentials.email)).then(res => res[0])

                if (!user || user.role != "Handler") return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!passwordMatch) return null;

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
        CredentialsProvider({
            id: "incident-access",
            name: "Incident Access",
            credentials: {
                incidentId: { label: "Incident ID", type: "text" },
                secretCode: { label: "Secret Code", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.incidentId || !credentials.secretCode) return null;

                // 1. find incident
                const incident = await db.select()
                    .from(incidents)
                    .where(eq(incidents.incidentIdDisplay, credentials.incidentId))
                    .then(res => res[0])

                if (!incident) return null;

                // 2. verify secret code

                try {
                    const isValid = await argon2.verify(
                        incident.secretCodeHash,
                        credentials.secretCode.trim() + process.env.INCIDENT_SECRET_PEPPER!
                    );

                    if (!isValid) {
                        console.log("Invalid secret code attempt:", credentials.incidentId);
                        return null;
                    }
                } catch (err) {
                    console.error("argon2 verification error:", err);
                    return null;
                }

                // 3. return pseudo-user
                return {
                    id: incident.id,
                    incidentId: incident.id,
                    incidentIdDisplay: incident.incidentIdDisplay,
                    type: "incident"
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.id = user.id;
                token.type = (user as any).type ?? "user";

                if (token.type === "incident") {
                    token.incidentId = (user as any).incidentId;
                    token.incidentIdDisplay = (user as any).incidentIdDisplay;
                }
            }
            return token;
        },

        async session({ session, token }) {


            if (token && session.user) {
                session.user.id = token.id;
                session.type = token.type;

                if (token.type == "incident") {
                    session.incidentId = token.incidentId;
                    session.incidentIdDisplay = token.incidentIdDisplay;
                }
            }

            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "./signin"
    },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };