"use client";
import {
  ClipboardList,
  ClipboardCheck,
  MessageCircleMore,
  Share2,
  Unplug,
} from "lucide-react";
import Navbar from "./components/Navbar";
import FileDropzone from "./components/FileDropzone";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { toast } from "sonner";
import Chat from "./components/Chat";

interface ChatMessage {
  sender: "You" | "Connected Peer";
  text: string;
}

export default function Home() {
  const [peer, setPeer] = useState<any>(null);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [myCode, setMyCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [conn, setConn] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [openChat, setOpenChat] = useState(false);
  const [typed, setTyped] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);

  const openChatRef = useRef(openChat);
  useEffect(() => {
    openChatRef.current = openChat;
  }, [openChat]);

  useEffect(() => {
    const p = new Peer();

    p.on("open", async (id: string) => {
      setMyPeerId(id);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId: id }),
      });
      const data = await res.json();
      setMyCode(data.code);
    });

    p.on("connection", (c) => {
      setConn(c);
      toast.success("Peer Connected!", {
        description: "You can now chat or share files.",
      });
      handleIncomingData(c);
    });

    setPeer(p);
  }, []);

  const handleIncomingData = (connection: any) => {
    connection.on("data", (data: any) => {
      if (data?.type === "file") {
        const blob = new Blob([data.buffer]);
        const url = URL.createObjectURL(blob);

        setReceivedFiles((prev) => [
          ...prev,
          { name: data.name, size: data.size, url },
        ]);

        toast.success("File Received!", {
          description: `${data.name} (${(data.size / 1024).toFixed(1)} KB)`,
        });

        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "Connected Peer", text: data },
      ]);

      if (!openChatRef.current) {
        toast("New Message", {
          description: "Open chat box to checkout the message",
        });
      }
    });
  };

  const connectUsingCode = async () => {
    const res = await fetch("/api/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: inputCode }),
    });

    const data = await res.json();
    if (data.error) {
      toast.error("Invalid code");
      return;
    }

    const otherPeerId = data.peerId;
    const connection = peer.connect(otherPeerId);

    connection.on("open", () => {
      setConn(connection);
      toast.success("Peer Connected!", {
        description: "You can now chat or share files.",
      });
    });

    handleIncomingData(connection);
  };

  const sendMessage = () => {
    if (!conn || !typed.trim()) return;
    conn.send(typed);
    setMessages((prev) => [...prev, { sender: "You", text: typed }]);
    setTyped("");
  };

  const sendFile = async () => {
    if (!conn || !selectedFile) {
      toast.error("No file selected");
      return;
    }

    const arrayBuffer = await selectedFile.arrayBuffer();

    conn.send({
      type: "file",
      name: selectedFile.name,
      size: selectedFile.size,
      buffer: arrayBuffer,
    });

    toast.success("File sent!");
  };

  return (
    <>
      <Navbar />
      <div
        className="
        relative flex flex-col gap-4 items-center justify-center

        max-md:px-3 max-md:pt-4
        "
      >
        <div
          className="
          relative w-120 h-50 rounded-2xl p-4 bg-neutral-800 flex flex-col gap-6 justify-start items-center

          max-md:w-full max-md:h-auto max-md:py-6 max-md:px-4
          "
        >
          {conn ? (
            <>
              <h1 className="font-semibold text-xl max-md:text-lg">
                Your Code
              </h1>
              <h1 className="font-extrabold text-4xl max-md:text-3xl">
                Connected Successfully
              </h1>
            </>
          ) : (
            <>
              <h1 className="font-semibold text-xl max-md:text-lg">
                Your Code
              </h1>
              <h1 className="font-extrabold text-6xl max-md:text-4xl">
                {myCode || "generating..."}
              </h1>
              <div
                onClick={() => {
                  if (myCode) {
                    navigator.clipboard.writeText(myCode);
                    toast.success("Code copied!", { description: myCode });
                  }
                }}
                className="absolute bottom-5 right-5 max-md:right-3 max-md:bottom-3 bg-neutral-600 p-2.5 rounded-md cursor-pointer hover:opacity-80"
              >
                <ClipboardList />
              </div>
            </>
          )}
        </div>

        <div
          className="
          w-280 h-100 rounded-2xl bg-neutral-800 flex flex-row justify-between items-center p-4 px-6

          max-lg:w-full max-md:flex-col max-md:h-auto max-md:gap-6 max-md:p-4
          "
        >
          <div
            className="
            w-[48%] h-[95%] bg-white/10 rounded-2xl flex flex-col items-center p-4 gap-6

            max-md:w-full max-md:h-auto
            "
          >
            <h1 className="font-semibold text-2xl max-md:text-xl">
              Enter code to connect
            </h1>

            <div className="w-full flex justify-center items-center gap-2">
              <input
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                type="number"
                placeholder="Enter Connection Code"
                className="
                w-[80%] py-4 bg-neutral-800 rounded-xl text-center text-3xl font-bold placeholder:text-2xl border-none outline-none

                max-md:text-2xl max-md:py-3
                "
              />

              <button
                onClick={async () => {
                  const text = await navigator.clipboard.readText();
                  if (text) {
                    setInputCode(text);
                    toast.success("Code pasted!");
                  }
                }}
                className="flex items-center bg-neutral-800 p-2.5 rounded-md cursor-pointer hover:opacity-80"
              >
                <ClipboardCheck />
              </button>
            </div>

            <button
              onClick={connectUsingCode}
              className="
              bg-neutral-800 flex flex-row justify-center items-center gap-2 p-4 w-80 mt-6 rounded-2xl cursor-pointer hover:opacity-80

              max-md:w-full max-md:py-3 max-md:text-lg
              "
            >
              <Unplug /> Connect
            </button>
          </div>

          <div
            className="
            w-[48%] h-[95%] bg-white/10 rounded-2xl flex flex-col items-center justify-between p-6

            max-md:w-full max-md:h-auto max-md:gap-4
            "
          >
            <FileDropzone onFileSelect={(file) => setSelectedFile(file)} />

            <button
              onClick={sendFile}
              className="
              bg-neutral-800 flex flex-row items-center justify-center gap-2 p-4 w-80 rounded-2xl

              max-md:w-full max-md:py-3 max-md:text-lg
              "
            >
              <Share2 /> Send File
            </button>
          </div>
        </div>

        {conn && (
          <div
            onClick={() => setOpenChat(true)}
            className="
            absolute flex justify-center items-center w-15 h-15 cursor-pointer hover:opacity-80 rounded-full bg-neutral-100 bottom-0 right-5

            max-md:bottom-4 max-md:right-4 max-md:w-14 max-md:h-14
            "
          >
            <MessageCircleMore className="text-black" />
          </div>
        )}

        {openChat && (
          <Chat
            typed={typed}
            setTyped={setTyped}
            setOpenChat={setOpenChat}
            sendMessage={sendMessage}
            messages={messages}
          />
        )}

        {receivedFiles.length > 0 && (
          <div
            className="
            w-120 bg-neutral-800 rounded-2xl p-4 flex flex-col gap-3 mt-6

            max-md:w-full max-md:p-3
            "
          >
            <h2 className="text-xl font-bold text-white max-md:text-lg">
              Received Files
            </h2>

            {receivedFiles.map((file, i) => (
              <div
                key={i}
                className="
                flex justify-between items-center bg-neutral-700 p-3 rounded-xl text-white

                max-md:flex-col max-md:items-start max-md:gap-3
                "
              >
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-sm opacity-75">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <a
                  className="
                  px-4 py-2 bg-neutral-900 rounded-lg hover:opacity-80 
                  max-md:w-full max-md:text-center
                  "
                  href={file.url}
                  download={file.name}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
