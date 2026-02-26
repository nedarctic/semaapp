import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        type: unknown;
        incidentId: unknown;
        incidentIdDisplay: unknown;
        user: {
            id: string;
        } & DefaultSession[user];
    }

    interface User {
        id: string;
    }
}