import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div>
      <div
        ref={ref}
        className={`message owner`}
      >
        <div className="messageInfo">
          <img
            src={
              currentUser.photoURL
            }
            alt=""
          />
        </div>
        <div className="messageContent">
          <p>{message.question}</p>
        </div>
      </div>
      <div
      ref={ref}
      className={`message`}
    >
      <div className="messageInfo">
        <img
          src={
            currentUser.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        <p>{message.answer}</p>
      </div>
    </div>
    </div>

  );
};

export default Message;
