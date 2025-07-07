import ChatListStyled from "../../components/chats/ChatList";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";


export default function ChatsTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Chats" />
      <div className="space-y-6">
        <ChatListStyled />
      </div>
    </>
  );
}
