import { createContext, useContext } from "react";
import api from "../services/api";

const MessageContext = createContext();


export const MessageProvider = ({children}) => {
    
    const getChatsAsync = async () => {
        const userId = localStorage.getItem("userId")

        const getMessagesUserMessagingResponse = await api.get(`Message/GetAllChats`,{
            params:{
                UserId: userId
            }
        })
        return getMessagesUserMessagingResponse;
    }

    const getBetweenChatsAsync = async (receiverId, messageSize = 30,         messageStack = 1) => {
    const senderId = localStorage.getItem("userId");

     const response = await api.get("Message/GetBetweenUserMessages",
          {
            params: {
              SenderId: senderId,
              ReceiverId: receiverId,
              MessageSize: messageSize,
              MessageStack: messageStack
            }
          }
        );

  return response;
    };


    const sendMessageAsync = async (content, receiverId) => {
    const senderId = localStorage.getItem("userId");
          const response = await api.post("Message/AddMessage",
            {
              Content: content,
              SenderId: senderId,
              ReceiverId: receiverId
            }
          );
      
          return response;
        };
    return(
        <MessageContext.Provider value={{getChatsAsync, getBetweenChatsAsync, sendMessageAsync}}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessage = () => useContext(MessageContext);