"use client";
import { useState } from "react";
import { X } from "lucide-react";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] h-[560px] rounded-2xl overflow-hidden border border-purple-200 shadow-2xl flex flex-col bg-white">
          <div className="bg-[#685FFF] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-sm font-semibold">AI Health Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <iframe
            src="https://app.relevanceai.com/agents/d7b62b/fb382fa6-dbe8-422e-8742-4893bed6e27d/22dd8fc9-1651-4591-b812-55f207a000a4/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false"
            allow="microphone"
            className="flex-1 border-none w-full"
            title="AI Health Assistant"
          />
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-[#685FFF] hover:bg-[#5548ee] flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          {open ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          )}
        </button>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center border-2 border-white">1</span>
        )}
      </div>
    </div>
  );
}