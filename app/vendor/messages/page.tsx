"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCheck, User } from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { Button } from "@/components/ui/button";

const sampleMessages = [
  {
    id: "msg-1",
    customer: "Ama K. Osei",
    product: "iPhone 16 Pro Max 256GB",
    time: "Today, 09:15 AM",
    query: "Hello! Is the Natural Titanium color currently in stock at your East Legon store?",
    replied: false,
    response: ""
  },
  {
    id: "msg-2",
    customer: "Kofi Boateng",
    product: "MacBook Pro 14 M3",
    time: "Yesterday, 04:30 PM",
    query: "Does this laptop come with the official 1-year Apple international warranty?",
    replied: true,
    response: "Yes! All MacBooks sold by our store include 1-year official Apple Warranty and store support."
  }
];

export default function VendorMessagesPage() {
  const activeVendorId = useVendorStore((state) => state.activeVendorId);
  const vendors = useVendorStore((state) => state.vendors);
  const vendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  const [messages, setMessages] = useState(sampleMessages);
  const [selectedMsgId, setSelectedMsgId] = useState(sampleMessages[0].id);
  const [replyText, setReplyText] = useState("");

  const activeMsg = messages.find((m) => m.id === selectedMsgId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMsgId ? { ...m, replied: true, response: replyText } : m))
    );
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-extrabold text-white">Customer Messages & Support</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Respond to product inquiries for <strong className="text-white">{vendor?.name}</strong>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Messages List */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-xl space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMsgId(m.id)}
              className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                selectedMsgId === m.id
                  ? "border-brand-blue bg-brand-blue/15 text-white"
                  : "border-white/5 bg-zinc-950/60 text-zinc-300 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{m.customer}</span>
                <span className="text-[10px] text-zinc-400">{m.time}</span>
              </div>
              <p className="text-[11px] text-brand-blue font-medium mt-1">{m.product}</p>
              <p className="text-xs text-zinc-400 truncate mt-1">{m.query}</p>
            </div>
          ))}
        </div>

        {/* Message Details & Reply */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">{activeMsg.customer}</h2>
                <p className="text-xs text-brand-blue font-medium">Inquiry about: {activeMsg.product}</p>
              </div>
              <span className="text-xs text-zinc-400">{activeMsg.time}</span>
            </div>

            {/* Inquiry Box */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-xs text-zinc-200">
              <p className="font-semibold text-zinc-400 mb-1">Customer Query:</p>
              <p className="leading-relaxed">{activeMsg.query}</p>
            </div>

            {/* Merchant Reply if already replied */}
            {activeMsg.replied && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300 space-y-1">
                <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCheck className="h-4 w-4" /> Sent Merchant Response:
                </p>
                <p className="leading-relaxed">{activeMsg.response}</p>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-white/10">
            <textarea
              rows={3}
              placeholder="Type your response to the customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 p-3 text-xs text-white placeholder-zinc-500 focus:border-brand-blue focus:outline-none"
            />
            <div className="flex justify-end">
              <Button type="submit" className="h-10 px-5 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Send Customer Response
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
