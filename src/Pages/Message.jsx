import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/Message.css'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { FaRegCircle } from 'react-icons/fa6';
import { IoIosArrowBack } from "react-icons/io";
import { startSignalRConnection, getConnection } from '../services/signalrservice';
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils';
import { FaLock } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { BiSolidSend } from "react-icons/bi";
import { useMessage } from '../contexts/MessageContext';
import { addSignalRHandler, removeSignalRHandler } from '../services/signalrservice';

const Message = () => {

    //#region CONTEXTS
    const {wakeAuthAsync, getUserByIdAsync} = useAuth();
    const {getBetweenChatsAsync, sendMessageAsync} = useMessage();
    ///#endregion

    //#region NAVIGATON
    const navigate = useNavigate();
    ///#endregion

    //#region BASE STATES
    const [isReady, setIsReady] = useState(false);
    const [myUserId, setMyUserId] = useState("");
    ///#endregion

    //#region MESAJLAR
    const [messages, setMessages] = useState([]);
    ///#endregion


  const getMessageBetweenUsers = async (messageCount, messageStack) => {
    const messageFriendId = localStorage.getItem("messageFriendId");
    const messagesRes = await getBetweenChatsAsync(messageFriendId, messageCount, messageStack);

    if(messagesRes.success){
      setMessages(messagesRes.data);
    }
    else return;
  }
  const [user, setUser] = useState({
         id: null,
         fullName: "",
         isOnline: false
        });
   


// HANDLERLER
// HANDLERLER
// HANDLERLER
/*const onFriendOnline = (data) => {

  if (data.userId === localStorage.getItem("messageFriendId")) {
    setUser((prev) => ({
      ...prev,
      isOnline: true
    }));
  }
};

const onFriendOffline = (data) => {

  if (data.userId === localStorage.getItem("messageFriendId")) {
    setUser((prev) => ({
      ...prev,
      isOnline: false
    }));
  }
};*/

const onFriendOnline = useCallback((data) => {

  const friendId = localStorage.getItem("messageFriendId");

  if (String(data.userId) === String(friendId)) {
    setUser(prev => ({
      ...prev,
      isOnline: true
    }));
  }
}, []);
    
const onFriendOffline = useCallback((data) => {

  const friendId = localStorage.getItem("messageFriendId");

  if (String(data.userId) === String(friendId)) {
    setUser(prev => ({
      ...prev,
      isOnline: false
    }));
  }
}, []);

    

const onReceiveMessage = useCallback((data) => {
  setMessages(prev => {
    return [...prev, data];
  });
}, []);
// HANDLERLER
// HANDLERLER
// HANDLERLER
const registerHandlers = () => {
    // connection.off("FriendOnline", onFriendOnline);
    // connection.off("FriendOffline", onFriendOffline);
    // connection.off("ReceiveMessage", onReceiveMessage);

    // connection.on("friendonline", onFriendOnline);
    // connection.on("friendoffline", onFriendOffline);
    // connection.on("receivemessage", onReceiveMessage);

    addSignalRHandler("friendonline", onFriendOnline);
    addSignalRHandler("friendoffline", onFriendOffline);
    addSignalRHandler("receivemessage", onReceiveMessage);
  };

  const removeHandlers = () => {
    removeSignalRHandler("friendonline", onFriendOnline);
    removeSignalRHandler("friendoffline", onFriendOffline);
    removeSignalRHandler("receivemessage", onReceiveMessage);
  }
   useEffect(() => {
  const receiverId = localStorage.getItem("messageFriendId");
  const receiverFullName = localStorage.getItem("messageFullName");

  const getUserById = async () => {
    const userResponse = await getUserByIdAsync(receiverId);
    if (userResponse.success) {
      setUser({
        id: receiverId,
        fullName: receiverFullName,
        isOnline: userResponse.data.isOnline
      });
    }
  };

  const init = async () => {
    const wake = await wakeAuthAsync();

    if (!wake.success) {
      navigate("/giris-ve-kayit");
      return;
    }

    setMyUserId(localStorage.getItem("userId"));
    setIsReady(true);
    await getUserById();

    registerHandlers();
    // await startSignalRConnection(registerHandlers);
    await getMessageBetweenUsers(100, 1);
  };

  init();

  // return () => {
  //   const conn = getConnection();
  //   if (conn) {
  //     conn.off("friendonline", onFriendOnline);
  //     conn.off("friendoffline", onFriendOffline);
  //     conn.off("receivemessage", onReceiveMessage);
  //   }
  // };

  return () => {
    removeHandlers();
  };
}, []);


  //#region SAYFA AÇILINCA MESAJLARDA AŞAĞI KAYMA
  const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "auto",
    block: "end"
  });
}, []);


useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages]);
  ///#endregion


const [sendMessageContent,setSendMessageContent] = useState("");

  const sendMessage = async (e) => {
  e.preventDefault();

  const receiverId = localStorage.getItem("messageFriendId");
  const senderId = localStorage.getItem("userId");

  const sendMessageRes = await sendMessageAsync(
    sendMessageContent,
    receiverId
  );

  if (sendMessageRes.success) {
    // const newMessage = {
    //   id: sendMessageRes.data.id,
    //   content: sendMessageContent,
    //   senderId: senderId,
    //   receiverId: receiverId,
    //   createdAt: new Date().toISOString()
    // };
    // setMessages(prev => [...prev, newMessage]);
    setSendMessageContent("");
  } else return;
};


  //#region TARİH AYARI
  const formatMessageTime = (createdAt) => {
  const messageDate = new Date(createdAt);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfMessageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffTime = startOfToday - startOfMessageDay;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Bugün
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Dün
  if (diffDays === 1) {
    return `Dün ${messageDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // 2–6 gün önce
  if (diffDays < 7) {
    return `${diffDays} gün önce ${messageDate.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // 1 haftadan eski
  return messageDate.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
  ///#endregion



  return (
    <>
    <div className='mainLayout'>
        <header className='mainLayoutHeader'>
                    <img src='/Snowly.png' className='mainLayoutIcon'/>
                    <p>Snowly<FaRegCircle className={isReady === true ? "readyCircle readyCircleGreen" : "readyCircle readyCircleRed"}/></p>
                </header>
        <section className='chatHeader'>
            <button className='chatBackButton' onClick={() => navigate("/anasayfa")}><IoIosArrowBack /></button>
              <>
                  <div className='receiverInfo'>
                    <p>{user.fullName}</p>
                {user.fullName && (
                  <p className={user.isOnline ? "onlineOfflineInfoGreen" : "onlineOfflineInfoRed"}>
                  {user.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                  </p>
                  )}     
                    </div>
                    <button className='chatSettingsButton'><HiDotsHorizontal /></button>
              </>
        </section>
        <section className='chatMain'>
            <div className='chats'>
              <p className='chatMainInfo'><FaLock /> Mesajlarınız şifrelenmiş biçimde korunuyor. Siz dışında üçüncü şahıslar tarafından okunamaz.</p>
              {messages.map(message => {
                const isMine = message.senderId === myUserId;
                return (
                <div
                  key={message.id}
                  className={isMine ? "messsageWrapperSend" : "messsageWrapperReceive"}
                >
                  <div className="messageInfo">
                    {formatMessageTime(message.createdAt)}
                  </div>
                  <p className={`messagesBaloon ${isMine ? "send" : "receive"}`}>
                    {message.content}
                  </p>
                </div>
              );
            })}
                <div ref={messagesEndRef} />
            </div>
            <form className='sendMessageDiv' onSubmit={sendMessage}>
                <input className='sendMessageInput' placeholder='Mesaj yaz' type='text' value={sendMessageContent} onChange={(e) => setSendMessageContent(e.target.value)} required/>
                <button className='sendMessageButton'><BiSolidSend /></button>
            </form>
        </section>
     </div>   
    </>
  )
}

export default Message
