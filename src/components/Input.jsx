import React, { useContext, useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  addDoc,
  collection,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [answer, setAnswer] = useState();
  const questionRef = useRef(null);
  const passage = `Degree in Law The Law program aspires to train professionals with a legal, dialectical, non-static, critical, committed vocation, who strive to achieve social change, to reduce problems of social adaptation, inequalities, insecurity, who practice ethical and moral values ​​and above all a sensitive professional identified with those most in need, that is, a humanized professional, has the Admission Requirements PAA-900 points| Profile of the degree program in law is Represent natural or legal persons in court and before administrative authorities, Do justice by issuing resolutions in accordance with the law in disputes that are submitted to their knowledge, Resolve conflicts between parties before submitting them to the knowledge of the jurisdictional instance, Advise natural and legal persons to resolve their legal problems, Participate in the formulation, analysis, creation and interpretation of laws, Represent Honduras before the international community, Represent the state before jurisdictional bodies , Participate in the legalization of land ownership, Develop teaching activities at different educational levels and much more. | Profile of the graduate of the bachelor's degree in law The lawyer can work in public and private institutions, the judiciary, commercial companies, deconcentrated and autonomous organizations, the different Secretaries of State, the National Congress, the Public Ministry, the Attorney General's Office General of the Republic, The Cooperatives, The Bank, The International Organizations, The Chamber of Commerce, The trade union groups, The public and private universities, The Banking and Insurance Commission, The representations of Honduras abroad, Also dedicated to the independent professional practice |`
  const [model, setModel] = useState(null);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const loadModel = async () => {
    const loadedModel = await qna.load()
    setModel(loadedModel);
    console.log('Model loaded.')
  }

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


  const answerQuestion = async (e) => {
    setAnswer([]);
    if (model !== null) {
      const question = text;
      var answers = [];
      for (const pass of passage.split("|")) {
        answers = await model.findAnswers(question, pass);
        if (answers.length > 0) {
          setAnswer(answers);
          break;
        }
      }
      if (answers.length === 0) {
        answers.push({ text: "I don't have an answer, try to rephrase the question" });
      }
      console.log(answers.length)
      data.messages.push({ question, answer: answers[0].text });
      const newChat = [data]
      const chatDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(chatDocRef, {
        chats: newChat
      });
      setText("");
    }
  };

  useEffect(() => { loadModel() }, [])
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={answerQuestion}>Send</button>
      </div>
    </div>
  );
};

export default Input;