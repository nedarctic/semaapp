"use server";

import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { z } from 'zod';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function sendMessage({
    incidentId,
    senderId,
    content,
    senderType
}:
    {
        incidentId: string,
        senderId: string,
        content: string,
        senderType: "Handler" | "Reporter"
    }) {

    const session = await getServerSession(authOptions);
    if (!session) return null;


    await db.insert(messages).values({
        incidentId,
        senderId,
        senderType,
        content
    });

}

// schema for validation
const sendMessageSchema = z.object({
    content: z.string().min(1, "Message required"),
});

export async function sendMessageAction(
    incidentId: string, 
    senderId: string, 
    message: string,
    senderType: "Handler" | "Reporter"
 ) {


    // 3. parse data
    const parsedData = sendMessageSchema.safeParse({
        content: message.toString(),
    });

    console.log("parsed data", parsedData.data);

    // 4. if parsing fails return error
    if (!parsedData.success) {
        console.log(parsedData.error);
        return ({ error: JSON.parse(parsedData.error.message)[0].message });
    }

    // 5. persist data

    const { content } = parsedData.data;

    const data = {
        incidentId,
        senderId,
        content,
        senderType,
    }

    try {
        await sendMessage(data)
        return ({ success: true });

    } catch (error) {
        return ({ error: error?.toString() });
    }
}
