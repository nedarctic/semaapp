"use server"

import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import bcrypt from 'bcrypt';

type CreateMemberState = {
    success?: boolean;
    error?: string;
}

async function getUserId() {
    const session = await getServerSession(authOptions);

    const user = session?.user;
    const userId = user.id;
    return userId;
}

async function getCompanyId(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id));

    const companyId = user[0].companyId;
    return companyId;
}

// validation object
const CreateMemberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ error: "Email is required" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export async function CreateMemberAction(prevState: CreateMemberState, formData: FormData): Promise<CreateMemberState> {

    // parse form data
    const parsedData = CreateMemberSchema.safeParse({
        name: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
        password: formData.get("password")?.toString(),
        confirmPassword: formData.get("confirmPassword")?.toString(),
    });

    console.log("parsed data", parsedData);

    // return error if parsing fails

    if (!parsedData.success) {
        console.log(parsedData.error);
        return ({ error: JSON.parse(parsedData.error.message)[0].message });
    }

    // fetch user company id
    const userId = await getUserId();
    const companyId = await getCompanyId(userId);

    // hash pass
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const payload = {
        name: parsedData.data.name,
        email: parsedData.data.email,
        password: hashedPassword,
        companyId: companyId
    };

    console.log("User payload for insertion", payload)

    // create member

    try {
        await db.insert(users).values(payload);

    } catch (error) {
        return { error: error instanceof Error ? error.message.toString() : "Uknown error" };
    }
    redirect("/dashboard/team");
}