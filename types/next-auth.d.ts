import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        type: "admin" | "handler" | "incident";
        incidentId?: string;
        incidentIdDisplay?: string;
        user: {
            id: string;
        } & DefaultSession[user];
    }

    interface User {
        id: string;
        type: "handler" | "admin" | "incident";
        incidentId?: string;
        incidentIdDisplay?: string;
    }
}