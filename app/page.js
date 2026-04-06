"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Convert image to base64
  const handleImage = (file) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    const newChat = [
      ...chat,
      {
        role: "user",
        text: message,
        image: preview,
      },
    ];

    setChat(newChat);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        image,
      }),
    });

    const data = await res.json();

    setChat([
      ...newChat,
      {
        role: "bot",
        text: data.reply,
      },
    ]);

    setMessage("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Chatbot 🚀</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-[70%] ${
              msg.role === "user" ? "ml-auto items-end" : "items-start"
            }`}
          >
            {/* Image Preview */}
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                className="w-40 rounded mb-1 border border-gray-600"
              />
            )}

            {/* Text */}
            {msg.text && (
              <div
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500"
                    : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>


      {/* we can add more features here....... later if needed */}
      

      {/* Preview before sending */}
      {preview && (
        <div className="mb-2">
          <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
          <img
            src={preview}
            alt="preview"
            className="w-32 rounded border border-gray-600"
          />
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2 mt-2">
        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
          className="text-sm"
        />

        {/* Text Input */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 outline-none"
          placeholder="Type a message or upload image..."
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}