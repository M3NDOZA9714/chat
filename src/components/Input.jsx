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
  const passage = `First History of the University Several young Hondurans, friends and students of Father José Trinidad Reyes called Máximo Soto, Alejandro Flores, Miguel Antonio Rovelo, Yanuario Girón and Pedro Chirinos, decided to found a study society, which they inaugurated on December 14, 1845 with the name of "Society of Entrepreneurial Genius and Good Taste", the first antecedent of the University. | March 10, 1846 The Private Society of Entrepreneurial Genius and Good Taste received protection from the country's government, under the name of the "Literary Academy of Tegucigalpa" and directed by Father Reyes, By 1847, President Juan Lindo and Father José Trinidad Reyes agreed on the convenience of transforming the Academy into a State University, which is why in the following months changes and appointments were made to adapt the new academic structure. | September 19, 1847 The University was solemnly inaugurated in a public ceremony led by President Juan Lindo and Rector José Trinidad Reyes, considered precisely as founders of the first house of studies in the country, The University operated for several years in the San Francisco Convent, located in the current Valle de Tegucigalpa Park. | Between 1896 and 1965 After having its headquarters in the San Francisco Convent of Tegucigalpa, the University moved to the building next to the La Merced Church in 1896, where it remained until it was transferred to what is now Ciudad Universitaria, whose construction It began on June 30, 1965. | Conquest of University Autonomy The University conquered Autonomy on October 15, 1957 by virtue of Decree No170 issued by the Military Junta of the Government, constituted by Messrs, Héctor Caraccioli and Roberto Gálvez Barnes. | That same decree contains the first Organic Law of the National Autonomous University of Honduras, in force until February 11, 2005, when it was replaced by the new Law approved by the National Congress according to decree number 209-2004. | Vision A leading national and international higher education institution, protagonist in the transformation of Honduran society towards sustainable human development with human resources of the highest academic, scientific and ethical level, An institution with a democratic government, organized in networks and decentralized, transparent in accountability, with academic and administrative/financial management, participatory, strategic, modern and oriented towards the quality and relevance of education, research and its linkage with Honduran and global society, processes based on the new paradigms of science and education. | Mission We are a state and autonomous university constitutionally responsible for organizing, directing and developing the third and fourth levels of the national educational system, Our scope of scientific production and action is universal, Our commitment is to contribute through the training of professionals, research and the university-society link to the sustainable human development of the country and through the science and culture that we generate, contribute to all of Honduras participating in universality and to develop in conditions of equity and humanism, addressing academic relevance to the various regional and national needs, Principles and Values, Creativity, Decentralization, Equity, Historicity, Integrity, Freedom, Perfectibility, Plurality, Progress, Rationality, Solidarity, Tolerance, Universality | The organic structure of the National Autonomous University of Honduras (UNAH) is divided into the following levels Higher Management, Executive and Academic, Control, Auxiliary Body | Higher Management University Council, University Management Board | Executive and Academic Rector's Office, General Counsel, General Secretary, Executive Secretary for Infrastructure Project Administration, Executive Secretary for Administration and Finance, Executive Secretary for Institutional Development, Executive Directorate for Management and Technology, Strategic Communication Directorate, Academic Vice-Rector's Office, Vice-Rector's Office for Guidance and Student Affairs, Vice-Rector's Office for International Relations, Faculties, Regional Centers | Control Management Control Commission, Internal Audit | Auxiliary Body Directorate of Higher Education, University Commissioner | ATTRIBUTION The Organic Law of the UNAH, in its article 23, grants the Academic Vice-Rector's Office the power to formulate the Academic Standards and propose them to the University Council, through the Rector's Office, for approval. | APPROVAL Within the framework of the Comprehensive Reform of the University, the University Council approved the Academic Standards of the UNAH, according to Agreement No CU-E-107-09-2014, Minutes No CU-E-002-06-2014 and published in the Official Gazette La Gaceta number 33,360 of January 13, 2015. | What are the UNAH Academic Standards? The UNAH Academic Standards are a set of fundamental principles and provisions that regulate the institutional academic activity and that of the members of the university community, These have their scope of application in all Academic and Administrative Units, and other members of the community, university, being mandatory, These new Academic Standards adapt to international trends in higher education, They are based on the recognition of higher education as a fundamental human right and a social public good, their objective is to regulate, govern and order the development and permanent growth of institutional academic activity. | Valid as of 2015 The undersigned, General Secretary of the National Autonomous University of Honduras (UNAH), by this act CERTIFIES Agreement No CU-E-107-09-2014 of Minutes No CU-E-002-06-2014 of the Extraordinary Session of the University Council, held on June twenty-six, July twenty-four, August twenty-one, September twenty-four and twenty-five, two thousand fourteen, regarding the approval of the Academic Standards of The National Autonomous University of Honduras, which literally says CERTIFICATION N°010 -2014, The undersigned Secretariat of the University Council of the National Autonomous University of Honduras (UNAH), by this act, CERTIFIES Agreement No CU-E-107-09-2014, contained in Minutes No CU-E-002-06 -2014 of dates June twenty-sixth, July twenty-fourth, August twenty-first, September twenty-fourth and twenty-fifth of two thousand and fourteen, which literally says “Oficio SCU-No119-2014, November 3, 2014, Master JULIETA CASTELLANOS, Rector UNAH, Her Office, Madam Rector The Secretariat of the University Council of the National Autonomous University of Honduras informs you that in the Extraordinary Session held on Thursday the twenty-sixth of June, Thursday the twenty-fourth of July, Thursday the twenty-first of August, Wednesday the twenty-fourth and Thursday the twenty-fifth of September of two thousand and fourteen, in Minutes Number CU-E-002-06-2014 drawn up for this purpose, there is AGREEMENT No CU-E-107-09-2014, which in its operative part says “AGREEMENT No CU- E-107- 09-2014, AGREES FIRST Approve the FOLLOWING ACADEMIC STANDARDS OF THE NATIONAL AUTONOMOUS UNIVERSITY OF HONDURAS | The ACADEMIC OFFER that we have is, Bachelor's Degree in Law, Bachelor's Degree in Journalism, Bachelor's Degree in Psychology, Bachelor's Degree in Pedagogy, Systems Engineering, Civil Engineering, Industrial Electrical Engineering, Medicine, Dentistry and Nursing | Degree in Law The Law program aspires to train professionals with a legal, dialectical, non-static, critical, committed vocation, who strive to achieve social change, to reduce problems of social adaptation, inequalities, insecurity, who practice ethical and moral values and above all a sensitive professional identified with those most in need, that is, a humanized professional, has the Admission Requirements PAA-900 points | Profile of the degree program in law Represent natural or legal persons in court and before administrative authorities, Do justice by issuing resolutions in accordance with the law in disputes that are submitted to their knowledge, Resolve conflicts between parties before submitting them to the knowledge of the jurisdictional instance, Advise natural and legal persons to resolve their legal problems, Participate in the formulation, analysis, creation and interpretation of laws, Represent Honduras before the international community, Represent the state before jurisdictional bodies , Participate in the legalization of land ownership, Develop teaching activities at different educational levels and much more. | Profile of the graduate of the bachelor's degree in law The lawyer can work in public and private institutions, the judiciary, commercial companies, deconcentrated and autonomous organizations, the different Secretaries of State, the National Congress, the Public Ministry, the Attorney General's Office General of the Republic, The Cooperatives, The Bank, The International Organizations, The Chamber of Commerce, The trade union groups, The public and private universities, The Banking and Insurance Commission, The representations of Honduras abroad, Also dedicated to the independent professional practice | Bachelor's Degree in Journalism This degree has leadership in the training of communicators with high academic and scientific level, ethical and moral values, with social commitment, capable of guiding and promoting changes in Honduran society and successfully facing the challenges and demands of reality, social Admission Requirements PAA-900 points and an Interview | Profile of the bachelor's degree in journalism Conducting journalistic programs in radio, television and written press, Directing public relations institutions of public and private organizations, Conducting research in different journalistic fields that contribute to solving national problems, Organizing and directing journalistic companies of diverse nature, Operate in any communication process, Organize information systematically for journalistic purposes, Efficiently manage social media Press, Radio, TV, Prepare messages of any journalistic nature, Evaluate the country's information to select the interest for abroad | Profile of the graduate of the bachelor's degree in journalism Fluent in Spanish and with aspirations to learn another language, Be able to communicate and understand ideas orally and in writing in a clear, coherent and timely manner, Establish good interpersonal relationships with the people they associate with, Assimilate social, political, cultural and economic phenomena in order to be able to transmit them to others, Mastery of the Internet, Positive attitude towards research | Bachelor's Degree in Psychology The Psychology degree trains professionals capable of studying, understanding and analyzing the acts, behaviors and normal and abnormal mental processes of human beings through the observation of their actions, reactions, decisions, verbal behavior, body movement and other events, observables, as well as through the application of scientific instruments, to reach conclusions and provide diagnoses and solutions to problems, The Psychologist emphasizes the analysis of the human being as a social being, who develops within specific family, group and community environments, which influence his development and conception of reality, Admission requirements are PAA-900 points| Profile of the degree program in Psychology The following activities are developed Prevention in mental health, counseling, evaluations, re-educational programs, crisis intervention, Human Resources Administration, consulting, training, Application of intervention techniques in communities and research of psychosocial problems, Various studies of human behavior and problems of the national reality, Planning and development of courses, seminars, workshops and other training and motivation events, Design and execution of psychopedagogical recovery programs in children and adolescents, Psychological guidance to children, young people, adults and the elderly, Perform psychological diagnoses and care of cases and provide individual and group psychotherapeutic treatment, Design and direct community and business development projects.| Profile of the graduate of the bachelor's degree in Psychology Capacity for empathy, Initiative and creativity, Scientific attitude, Objectivity, Social Awareness, Sense of Responsibility, Emotional Balance, Capacity for analysis and social awareness, Permanent desire for service, Professional Ethics. | Bachelor's Degree in Pedagogy The Pedagogy and Educational Sciences Program trains university professionals who have technical and scientific knowledge of Planning, Administration, Organization, Management, Supervision, Guidance, and Special Education, Admission requirements are PAA - 700 points | Profile of the degree program in pedagogy You are trained to develop the following activities Formulate education policies, Plan, Organize and Evaluate education at its different levels, Educational Research, Develop curricular plans, Management of education finances, Management of education programs educational guidance, Adult Education, Special education in the area of Mental Retardation and learning problems, Comprehensive training of human resources in the field of education | Profile of the graduate of the bachelor's degree in pedagogy, Apply the scientific method in solving problems through diagnosis, planning, execution and evaluation in the development of education, Ease of exercising leadership within the educational field, Ease of oral expression and writing, Identification with reality, Skill in managing technological equipment, Good interpersonal relationships, Capacity for analysis and synthesis, Positive attitude towards research, Administrative and organizational capacity The Attitudes of the Pedagogue are Empathy, Dynamism, Innovation, Participation, Reflection and Understanding, Emotional Stability, Civic Values, etc | Systems Engineering, Systems Engineering is a branch of Engineering that involves the planning, design, development, implementation and maintenance of information systems, which different companies or organizations use to process data and produce information, which helps in decision making, the Requirements are PAA 1000 points, Take the Mathematical Achievement Test (PAM), Compete in ranking for a place and See Admission procedures | Systems engineering career profile Evaluation, development and implementation of Information Systems and computer projects, Design, integration and installation of Data Networks, Design, implementation and maintenance of Databases, Design and implementation of new software products, Hardware design and integration, Design and implementation of Electronic Commerce projects. | Profile of the graduate of the systems engineering career Develop computer systems that solve specific process automation problems, Analyze and program systems using cutting-edge procedures, techniques and technology, Analyze, investigate and interpret plans and diagrams of computer systems, understand technology of change and be able to adapt and adopt it, Formulate and propose new computational solutions based on updated technology and processes. | Civil Engineering The American Society of Civil Engineers (ASCE) defines Civil Engineering as “the profession in which knowledge of the mathematical and physical sciences obtained by study, experience, and practice is applied judiciously to develop ways to economically use materials” and forces of nature, to create the progressive well-being of humanity, improving and protecting the environment, providing facilities for the life of communities, industry and transportation and providing infrastructure for the use of the human race” the Requirements are PAA 1000 points, Take the Mathematical Achievement Test (PAM), Compete in ranking for a place, See Admission procedures | Civil Engineering Career Profile Civil Engineering education plays a very responsible role in the contemporary world, This refers not only to professional capabilities, but also to more general human skills and attitudes, both personal and interpersonal, Our mission is not only the education and training of a qualified professional but also a responsible individual committed to society and the environment and with the highest ethical values | Profile of the graduate of the civil engineering career Analytical and synthesis capacity, Creativity and pragmatism, Ability to lead people, Conscientious and inquisitive mind, Commitment to updating processes and continuing education, With high ethical and moral values, Commitment to preservation of the environment, Ability to communicate in a second language | Industrial Electrical Engineering The Electrical Engineering degree forms university professionals in the different fields of electro technology, to support energy systems, communications and electronics applications and in this way promote the economic development of the country, the Requirements are PAA 1000 points, Take the Mathematical Achievement Test (PAM), Compete in ranking for a place, See Admission procedures | Profile of the industrial electrical engineering career The Electrical Engineering career develops the following activities Plans, designs, installs and operates electrical energy generation, transmission and distribution systems, communications systems, electronic and computerized industrial control systems, Provides consulting techniques in projects related to the field of electrical power, communications and computerized control applications, Independently directs and manages companies and projects related to the area, THE AREAS OF GUIDANCE ARE Power, Electromechanical Electronics, Communications | Profile of the graduate of the industrial electrical engineering degree Ability to Plan, Design and Build Electrical Communications Systems, Electronic Control and Computing, Skill in the management of technological resources and equipment, Ease of oral and written expression that allows him to exercise leadership, Ability Administrative and Organizational for the formation of your own Company | Medicine The purpose of the Medicine Course is to train medical professionals with a comprehensive vision, capable of detecting individual and community health problems, establishing diagnoses and establishing preventive measures, using technology rationally with the purpose of improving the quality of life of communities, and individual health problems, the Requirements are PAA 1100 points, Take the Knowledge of Natural and Health Sciences Test (PCCNS), Compete in ranking for a place, See Admission procedures | Profile of the medical career Carry out situational analysis of a community, detecting health problems and establishing preventive measures according to detected problems, Clinically addressing people who consult for health problems, using technology rationally, establishing curative and preventive measures and rehabilitation, establishing a prognosis, Become familiar with new technologies and sub-specialties, Use the scientific method in addressing health problems when developing research projects, Carry out directed practices in institutions related to the health field, Work as a team with the different professionals that make up the health team both at the institutional and private levels. | Profile of the graduate of the medical career Have facility for verbal and written expression, Ability to analyze and synthesize the information obtained from approaches to health problems, Organization and management capacity, Aptitude towards change, Work under pressure. | Dentistry The Dentistry program as a department of the UNAH maintains strategic leadership with the necessary quality to train professionals capable of responding to the oral health needs of the Honduran people, The requirements are PAA 1000 points, Take the Science Knowledge Test Natural and Health Products (PCCNS), Compete in ranking for a place | Dental career profile Improve the levels of oral health of the population, especially in the most needy groups, Establish the regulation and standardization of all actions that have to do with the prevention, promotion, cure and rehabilitation of oral health, Develop Projects that allow the solution of health problems, Establish criteria and actions that allow the evacuation of institutional administrative processes.| Profile of the graduate of the dentistry career Carry out activities of education, prevention, diagnosis and treatment of oral conditions, Analyze and interpret the humanistic and scientific knowledge that allows general training for a better contribution to the transformation of the national reality, Identify the normal structures of the mouth and manage with professionalism and a scientific basis the preparation of diagnoses that detect oral diseases and their pathological etiology, Develop projects of interest in the field of dentistry that lead to the solution of oral health problems and improvement of the quality of care, Apply knowledge Apply epidemiological knowledge that allows, through research and administration, the rational use of human, physical and economic resources of health institutions, Carry out practices and group work in the medical department legal for the knowledge of morpho-functional elements for forensic use. | Nursing The purpose of the School of Nursing is to train Nursing Professionals that respond to the health needs of the population in their context, consistent with new methodologies, scientific-technical advances and the changing situation of the country, health system and population groups, The graduate of the Nursing Career is a professional with human and technical scientific capacity who participates in the identification, analysis of the needs of the population and in the strengthening of their potential, as well as the provision of services, through dialogue and permanent intra- and extra-sectoral negotiation, stimulating the dynamism of the community in the decision-making processes to preserve health, the Requirements are PAA 900 points, Take the Knowledge Test of the Natural and Health Sciences (PCCNS), Compete in ranking for a place, See Admission procedures | Nursing career profile Comprehensive Care Direct health care with equity, efficiency and effectiveness for the individual, family and community, with a participatory and epidemiological approach, Administration Plan, Coordinate execute, evaluate and lead the different work processes, programs, health projects and services, Education Its monitoring process develops programs of Permanent Education of educational activity for the population, Continuing and permanent education of nursing staff and others Training of human resources, Research Used as a work tool that allows you to identify needs and problems in the work area, aimed at the transformation of services. | Profile of the graduate of the nursing career Ability to identify the national reality and the heterogeneity of different social groups, Develop critical and reflective thinking in the biological and cultural-historical explanation of the health-disease process, Assume a role of solidarity and commitment to oneself self and human groups, Create their own models and solutions to the different situations they face, Ease to handle various management as daily work tools, Capacity for permanent negotiation and in a sustainable way at a multi-sector level, Ease to interrelate with different social groups , Lead processes of promotion, prevention and transformation of health services, Capacity in the management of human and technological resources. |`
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
