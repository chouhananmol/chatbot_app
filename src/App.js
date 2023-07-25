import React, { useState, useEffect } from "react";
import botimg from "./assets/boticon.webp";
import userimg from "./assets/user.jpg";

const API_KEY = process.env.API_KEY;

const App = () => {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [g_res, setG_res] = useState([]);
  const [past_input, setPast_input] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [previouschats, setPreviousChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMessage = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: past_input, // include past user inputs
          generated_responses: g_res, // include generated responses
          text: value, // include user input text
        },
      }),
    };

    try {
      const response = await fetch("http://localhost:7000/api", options);
      const data = await response.json();
      // Update state with bot's response and conversation data
      setMessage(data.generated_text);
      setPast_input(data.conversation.past_user_inputs);
      setG_res(data.conversation.generated_responses);
      // console.log("message(botreply):" + data.generated_text);
      // console.log("past input:" + data.conversation.past_user_inputs);
      // console.log("responese gen:" + data.conversation.generated_responses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    setMessage("");
    setValue("");
    setCurrentTitle(null);
    setG_res([]);
    setPast_input([]);
  };

  const handleClick = (uniqueTitle) => {
    setMessage("");
    setValue("");
    setG_res([]);
    setPast_input([]);
    setCurrentTitle(uniqueTitle);
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((previouschats) => [
        ...previouschats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: "bot",
          content: message,
        },
      ]);
    }
  }, [message, currentTitle]);

  console.log(previouschats);

  const currentChats = previouschats.filter(
    (previouschats) => previouschats.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previouschats.map((previouschats) => previouschats.title))
  );
  console.log(uniqueTitles);

  // console.log("user:" + value + "\n" + "bot:" + message);

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made By Anmol</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1>TalkBot</h1>}

        <ul className="feed">
          {currentChats?.map((chatMessage, index) => (
            <li key={index} className="message-container">
              {chatMessage.role === "user" ? (
                <img className="message-image" src={userimg} alt="User" />
              ) : (
                <img className="message-image" src={botimg} alt="Bot" />
              )}
              <p
                className={
                  chatMessage.role === "user" ? "user-message" : "bot-message"
                }
              >
                {chatMessage.content}
              </p>
            </li>
          ))}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getMessage();
                }
              }}
              placeholder="Send Message"
            />
            <button
              id="submit"
              onClick={() => {
                getMessage();
              }}
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>

          <p className="info">
            Welcome to TalkBot! Type your message and press enter to start
            chatting
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
