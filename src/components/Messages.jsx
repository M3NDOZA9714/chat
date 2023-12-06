import { doc, onSnapshot, where, query, collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data.chatId) {
          const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
            const userData = doc.data();
            const userChats = userData.chats || [];
            doc.exists() && setMessages(userChats[0].messages);
          });
          return () => {
            unsub();
          };
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m}/>
      ))}
    </div>
  );
};

export default Messages;
