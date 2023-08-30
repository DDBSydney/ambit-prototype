"use client";

import {
  AmbitClient,
  ConnectionStatus,
  Activity,
} from "@ambit-ai/ambit-client";
import React, { useState, useEffect } from "react";
const botConnection = new AmbitClient({
  baseUrl: "https://volkswagen.clientdev.ambithub.com",
  secret: "yourSecretHere",
});

botConnection.connectionStatus$.subscribe((connectionStatus) => {
  if (connectionStatus === ConnectionStatus.Online) {
    // Connection estableshed sucessfully. Lets try sending a message to the bot
    const activity: Activity = {
      type: "message",
      from: botConnection.user,
      locale: "en-GB",
      text: "Hi",
    };

    botConnection.postActivity(activity).subscribe(); // post the activity to the Bot
  } else {
  }
});

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<string>>([]);

  const handleClick = (e: React.MouseEvent, searchTerm: string) => {
    e.preventDefault();
    botConnection
      .postActivity({
        type: "message",
        from: botConnection.user,
        locale: "en-GB",
        text: searchTerm,
      })
      .subscribe();
  };

  useEffect(() => {
    // Initialize the client
    // Subscribe to the connection status event

    botConnection.activity$.subscribe((activity) => {
      // An incoming activity has been recieved
      // @ts-ignore
      if (activity.type === "event" && activity.name === "synapseBotEvent") {
        // A generic bot event
      }
      if (
        activity.type === "operatorHandOver" ||
        activity.type === "operatorHandBack"
      ) {
        // Convesation handed over from and to the human operator
      }
      if (activity.type === "typing") {
        // console.log(JSON.stringify(activity));
      }
      if (activity.type === "message") {
        if (activity.from.id === botConnection.user.id) {
          // Received activity sent by the client
        } else {
          console.log(activity.text);
          // const newMessages = messages;
          // newMessages.push(activity.text);
          setMessages((m) => [...m, activity.text]);
          // Received activity sent by the bot
          // Typing event sent by the bot0
          const newMsg: Activity = {
            type: "message",
            from: botConnection.user,
            locale: "en-GB",
            text: "tell me about a loop",
          };

          // botConnection.postActivity(newMsg).subscribe();

          // post the activity to the Bot
        }
      }
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <button
        onClick={(e) => handleClick(e, message)}
        className="border-solid border-red-200 border-2 my-12 p-2"
      >
        SEND MESSAGE
      </button>
      <input
        className="border-solid border-red-200 border-2 p-4 my-12"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
      />

      {messages.map((message, i) => (
        <li key={`key-${i}`}>
          <span>{message}</span>
        </li>
      ))}
    </main>
  );
}
