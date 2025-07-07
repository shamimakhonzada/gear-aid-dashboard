import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, off, get } from "firebase/database";
import {
  MdOutlineDocumentScanner,
  MdLocationPin,
  MdPlayArrow,
  MdImage,
  MdAudiotrack,
  MdArrowBack,
} from "react-icons/md";
import ComponentCard from "../common/ComponentCard";

interface Message {
  audioMessage: boolean;
  documentMessage: boolean;
  imageMessage: boolean;
  videoMessage: boolean;
  locationMessage: boolean;
  latitude: number;
  longitude: number;
  message: string;
  senderId?: string;
  senderName?: string;
}

export default function ChatDetail() {
  const { mechanicId, userId } = useParams<{
    mechanicId: string;
    userId: string;
  }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mechanicName, setMechanicName] = useState("Mechanic");
  const [serviceUserName, setServiceUserName] = useState("User");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    if (!mechanicId) return;
    get(ref(db, `Users/Mechanic/${mechanicId}/name`)).then((snap) => {
      if (snap.exists()) setMechanicName(snap.val());
    });
  }, [mechanicId]);

  useEffect(() => {
    if (!userId) return;
    get(ref(db, `Users/Service User/${userId}/name`)).then((snap) => {
      if (snap.exists()) setServiceUserName(snap.val());
    });
  }, [userId]);

  useEffect(() => {
    if (!mechanicId || !userId) return;
    const msgRef = ref(db, `Users/Mechanic/${mechanicId}/messages/${userId}`);
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const allMsgs: Message[] = Object.values(data);
      setMessages(allMsgs);
    });
    return () => off(msgRef);
  }, [mechanicId, userId]);

  const isUserMessage = (msg: Message) => {
    if (msg.senderId) return msg.senderId === userId;
    const name = (msg.senderName || "").trim();
    if (name === serviceUserName.trim()) return true;
    if (name === mechanicName.trim()) return false;
    return false;
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase() || "?";

  const filtered = messages.filter((msg) =>
    msg.message.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts?: number) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ComponentCard
      title={mechanicName}
      button={
        <button
          onClick={() => navigate("/chat-tables")}
          className="flex items-center gap-1 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          <MdArrowBack /> Back
        </button>
      }
    >
      <div className="p-6 w-full mx-auto space-y-4">
        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        />

        {/* 💬 Messages */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No messages found.</p>
        ) : (
          filtered.map((msg, idx) => {
            const userSide = isUserMessage(msg);
            const bubbleAlign = userSide
              ? "items-start justify-start"
              : "items-end justify-end";
            const bubbleTail = userSide
              ? "after:content-[''] after:absolute after:-left-2 after:top-3 after:w-0 after:h-0 after:border-t-[6px] after:border-t-transparent after:border-b-[6px] after:border-b-transparent after:border-r-[6px] after:border-r-gray-200 dark:after:border-r-gray-700"
              : "after:content-[''] after:absolute after:-right-2 after:top-3 after:w-0 after:h-0 after:border-t-[6px] after:border-t-transparent after:border-b-[6px] after:border-b-transparent after:border-l-[6px] after:border-l-blue-500";
            const bubbleBg = userSide
              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "bg-blue-500 text-white";

            const sender = (msg.senderName || "Unknown").trim();

            return (
              <div key={idx} className={`flex gap-2 ${bubbleAlign} relative`}>
                {userSide && (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    {getInitial(sender)}
                  </div>
                )}

                <div
                  className={`relative rounded-lg px-4 py-3 max-w-xs sm:max-w-sm md:max-w-md shadow ${bubbleBg} ${bubbleTail}`}
                >
                  <div className="text-xs font-semibold mb-1">{sender}</div>

                  {/* TEXT */}
                  {!msg.imageMessage &&
                    !msg.audioMessage &&
                    !msg.videoMessage &&
                    !msg.documentMessage &&
                    !msg.locationMessage && (
                      <p className="text-sm">{msg.message}</p>
                    )}

                  {/* IMAGE */}
                  {msg.imageMessage && (
                    <div className="mt-2">
                      <MdImage className="inline mr-1" />
                      <img
                        src={msg.message}
                        alt="Sent"
                        className="w-full rounded"
                      />
                    </div>
                  )}

                  {/* AUDIO */}
                  {msg.audioMessage && (
                    <div className="mt-2">
                      <MdAudiotrack className="inline mr-1" />
                      <audio controls className="max-w-md">
                        <source src={msg.message} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* VIDEO */}
                  {msg.videoMessage && (
                    <div className="mt-2">
                      <MdPlayArrow className="inline mr-1" />
                      <video controls className="w-full rounded">
                        <source src={msg.message} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  {/* DOCUMENT */}
                  {msg.documentMessage && (
                    <div className="mt-2">
                      <MdOutlineDocumentScanner className="inline mr-1" />
                      <a
                        href={msg.message}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}

                  {/* LOCATION */}
                  {msg.locationMessage && (
                    <div className="mt-2">
                      <MdLocationPin className="inline mr-1" />
                      <a
                        href={`https://maps.google.com/?q=${msg.latitude},${msg.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View Location
                      </a>
                    </div>
                  )}
                </div>

                {!userSide && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {getInitial(sender)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </ComponentCard>
  );
}
