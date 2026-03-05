"use client";

import React, { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessageAction } from '@/actions/SendMessage';
import { InferSelectModel } from 'drizzle-orm';
import { messages } from '@/db/schema';

type Message = InferSelectModel<typeof messages>;

export default function IncidentHandlerChat({
  incidentId,
  incidentName,
  senderId,
  initialMessages,
}: {
  incidentId: string;
  incidentName: string;
  senderId: string;
  initialMessages: Message[];
}) {

  const router = useRouter();

  const senderType = "Handler";
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; error?: string }>({ success: false, error: undefined });
  const [message, setMessage] = useState<string>();

  const [messages, setMessages] = useState(initialMessages);

  useEffect (() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await sendMessageAction(incidentId, senderId, message!, senderType);

        setState({ success: true });
        router.refresh();

      } catch (error) {
        setState({ error: error instanceof Error ? error.message : "Unknown error" });
      }
    });
  }

  return (
    <section className="flex flex-col gap-12 border-t border-gray-200 dark:border-zinc-800 pt-16">

      <header className="flex flex-col gap-4 max-w-2xl">
        <h2 className="text-black dark:text-white text-2xl font-light">
          Secure communication
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
          This space enables confidential communication between you and this incident's reporter. All messages are logged and auditable.
        </p>
      </header>

      <div className="flex flex-col items-center justify-center h-screen w-full p-6">
        <div className="border-2 border-black dark:border-white rounded-xl flex flex-col items-start justify-between lg:w-2/3 w-full min-h-125 p-8 lg:p-10 space-y-3">
          <h1 className="text-2xl text-black dark:text-white">{incidentName} Chat Room</h1>
          <div className="overflow-y-auto h-80 w-full">
            <ul className="text-black font-normal text-sm dark:text-white space-y-2 mt-2">
              {messages.map((msg) => {

                return <li key={msg.id}><span className="bg-black text-white font-bold text-[12px] m-1 p-1 rounded-sm">{senderType}</span>: {msg.content}</li>
              })}
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-start justify-start space-y-2 w-full">

            <input name="content" onChange={e => setMessage(e.target.value)} required placeholder='Enter message' className="px-4 py-2 rounded-md border-2 border-black dark:border-white w-full" />
            {state.error && (<p className="text-red-600 text-sm font-normal">{state.error}</p>)}
            {/* {state.success && (<p className="text-green-600 text-sm font-normal">Sent successfully!</p>)} */}
            <button type="submit" className="rounded-full px-4 py-2 text-md font-semibold text-white bg-black dark:bg-white dark:text-black flex flex-col items-center justify-center">{isPending ? "Sending..." : "Send message"}</button>
          </form>
        </div>
      </div>

    </section>
  );
}