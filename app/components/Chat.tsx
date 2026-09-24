import { Send, X } from "lucide-react";
import React from "react";

interface ChatProps {
  typed: string;
  setTyped: React.Dispatch<React.SetStateAction<string>>;
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => void;
  messages: { sender: "You" | "Connected Peer"; text: string }[];
}

const Chat: React.FC<ChatProps> = ({
  typed,
  setTyped,
  setOpenChat,
  sendMessage,
  messages,
}) => {
  return (
    <div
      className="
        absolute flex flex-col items-center justify-between py-4 p-5 gap-4 bottom-0 right-5 
        h-150 w-100 rounded-2xl bg-neutral-100

        max-md:fixed max-md:bottom-0 max-md:right-0 
        max-md:w-full max-md:h-[85vh] max-md:rounded-none
        max-md:p-4 max-md:gap-3

        max-sm:h-[90vh] max-sm:p-3
      "
    >
      <div className="relative w-full flex justify-center">
        <div
          onClick={() => setOpenChat(false)}
          className="absolute rounded-full p-2 flex justify-center items-center bg-black 
            w-8 h-8 cursor-pointer hover:opacity-80 right-0
            max-md:w-7 max-md:h-7 max-md:p-1
          "
        >
          <X className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black max-md:text-2xl">
          CHATS
        </h1>
      </div>

      <div
        className="
          h-full hide-scrollbar w-full flex flex-col gap-4 p-2 overflow-y-auto
          max-md:gap-3 max-md:p-2
        "
      >
        {messages.map((msg, i) =>
          msg.sender === "You" ? (
            <div key={i} className="flex flex-row-reverse w-full text-white">
              <div
                className="
                  w-max text-right bg-neutral-800 px-8 rounded-2xl rounded-br-none py-2
                  max-md:px-5 max-md:py-2 max-sm:px-4
                "
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-row w-full text-black">
              <div
                className="
                  w-max text-right bg-neutral-300 px-8 rounded-2xl rounded-bl-none py-2
                  max-md:px-5 max-md:py-2 max-sm:px-4
                "
              >
                {msg.text}
              </div>
            </div>
          )
        )}
      </div>

      <div className="w-full flex items-center gap-2 max-md:gap-2 max-sm:gap-1">
        <input
          className="
            bg-neutral-900 px-4 rounded-2xl h-15 text-white w-full
            max-md:h-12 max-md:px-3
            max-sm:h-11 max-sm:px-3
          "
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Enter your message"
        />
        <button
          onClick={sendMessage}
          className="
            bg-black cursor-pointer hover:opacity-80 p-3 rounded-full flex items-center justify-center
            max-md:p-2.5 max-sm:p-2
          "
        >
          <Send className="w-6 h-6 max-md:w-5 max-md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
