import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { FiSearch } from "react-icons/fi";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MdVisibility } from "react-icons/md";

export default function ChatList() {
  type ChatPreview = {
    mechanicId: string;
    userId: string;
    mechanicName: string;
    userName: string;
    lastMessage: string;
  };

  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ChatPreview[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    const fetchChats = async () => {
      const mechanicsSnap = await get(ref(db, "Users/Mechanic"));
      const mechanics = mechanicsSnap.val() || {};
      const chatData: ChatPreview[] = [];

      for (const mechanicId in mechanics) {
        const mechanic = mechanics[mechanicId];
        const messages = mechanic?.messages || {};

        for (const userId in messages) {
          const msgKeys = Object.keys(messages[userId]);
          if (msgKeys.length === 0) continue;

          const lastMsgId = msgKeys[msgKeys.length - 1];
          const lastMsg = messages[userId][lastMsgId];

          chatData.push({
            mechanicId,
            userId,
            mechanicName: mechanic.name || "Unknown Mechanic",
            userName: lastMsg.senderName || "Unknown User",
            lastMessage: lastMsg.message || "No message",
          });
        }
      }

      setConversations(chatData);
      setFilteredConversations(chatData);
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = conversations.filter(
      (chat) =>
        chat.mechanicName.toLowerCase().includes(term) ||
        chat.userName.toLowerCase().includes(term)
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  return (
    <ComponentCard title="Chat Conversations">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or mechanic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FiSearch className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No conversations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="dark:text-white bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Service User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Mechanic
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-left"
                  >
                    Last Message
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-right"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((chat, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <TableCell className="px-6 py-4 text-left text-gray-900 dark:text-white">
                      {chat.userName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                      {chat.mechanicName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                      {chat.lastMessage.length > 50
                        ? chat.lastMessage.slice(0, 50) + "..."
                        : chat.lastMessage}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/chat/${chat.mechanicId}/${chat.userId}`
                          )
                        }
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        title="View Chat"
                      >
                        <MdVisibility className="text-xl" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
