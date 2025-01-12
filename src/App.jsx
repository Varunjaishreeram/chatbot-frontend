import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { user: "You", text: userMessage };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post("https://chatbot-backend-six-psi.vercel.app/chat", {
        message: userMessage},
    {
      headers: {
        "Content-Type": "application/json", // Ensures JSON data is sent
      },
      });

      const botResponse = "something went wrong!";
      const results = response.data.results;

      if (results) {
        const formattedResults = results.map((result, index) => (
          <div key={index} className="my-2">
            <p className="font-semibold">{index + 1}. {result.title}</p>
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {result.link}
            </a>
            {result.image && (
              <div className="mt-2">
                <img
                  src={result.image}
                  alt={result.title}
                  className="max-w-full mt-2 rounded-lg"
                />
              </div>
            )}
          </div>
        ));

        setMessages((prev) => [
          ...prev,
          { user: "Bot", text: formattedResults },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { user: "Bot", text: botResponse },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { user: "Bot", text: "Something went wrong!" },
      ]);
    }

    setUserMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Chatbot</h1>
      <div className="w-full max-w-lg bg-gray-800 shadow-md rounded-lg p-4 flex flex-col">
        <div
          className="flex-1 overflow-y-auto space-y-3 p-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          style={{ maxHeight: "400px" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`px-4 py-2 rounded-lg text-white max-w-xs break-words ${
                  msg.user === "You"
                    ? "bg-gray-700 rounded-bl-none"
                    : "bg-gray-600 rounded-br-none"
                }`}
              >
                {msg.user === "You" ? (
                  <>
                    <strong>{msg.user}:</strong> {msg.text}
                  </>
                ) : (
                  <>
                    <strong>{msg.user}: Top 3 results are here</strong> {msg.text}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress} 
            placeholder="Type a message"
            className="flex-1 border border-gray-600 bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
