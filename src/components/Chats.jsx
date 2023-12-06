import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        const userData = doc.data();
        const userChats = userData.chats || [];
        setChats(userChats);
      });
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_CHAT", payload: u })
  };

  const createNewChat = () => {
    // Crear un nuevo chat vacío
    const newChat = [...chats, {
      chatId: new Date().getTime(),
      messages: []
    }];
    // Obtener la referencia al documento del usuario actual
    const userRef = doc(db, "users", currentUser.uid);
    chats.push(newChat)
    updateDoc(userRef, {
      chats: newChat
    })
  };

  return (
    <div className="chats">
      <div
        className="userChat"
        onClick={() => createNewChat()}
      >
        <div className="userChatInfo">
          <span>Nuevo chat</span>
        </div>
      </div>
      {chats.length > 0 &&
        chats.map((chat) => (
          <div
            className="userChat"
            key={Object.keys(chat)[0]}
            onClick={() => handleSelect(chat)}
          >
            <div className="userChatInfo">
              <span>{chat.chatId}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
