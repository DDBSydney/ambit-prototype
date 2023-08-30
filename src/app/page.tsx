"use client";

import Image from "next/image";

import {
  AmbitClient,
  ConnectionStatus,
  Activity,
} from "@ambit-ai/ambit-client";
import React, { useState, useEffect } from "react";

// Initialize the client
const botConnection = new AmbitClient({
  baseUrl: "https://volkswagen.clientdev.ambithub.com",
  secret: "yourSecretHere",
});

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(new Map());
  const [activity, setActivity] = useState<Activity>({
    type: "message",
    from: botConnection.user,
    locale: "en-GB",
    text: "Hi",
  });

  const handleClick = (searchTerm: string) => {
    console.log(searchTerm);
    const newActivity = activity;
    newActivity.text = searchTerm;
    console.log(newActivity);
    setActivity({
      type: "message",
      from: botConnection.user,
      locale: "en-GB",
      text: searchTerm,
    });
    botConnection.connectionStatus$.subscribe((connectionStatus) => {
      console.log("31");
      if (connectionStatus === ConnectionStatus.Online) {
        botConnection.postActivity(newActivity).subscribe();
      } else {
      }
    });
  };

  useEffect(() => {
    console.log("effect");
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
      }
      if (activity.type === "typing") {
        console.log(`EV: ${activity.toString()}`);
      }
      if (activity.type === "message") {
        if (activity.from.id === botConnection.user.id) {
        } else {
          const existingMessages = messages;
          existingMessages.set(activity.timestamp, activity.text);
          setMessages(new Map(existingMessages));
        }
      }
    });
  }, [activity]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
      />
      <button onClick={() => handleClick(inputValue)}>Send</button>
      {messages &&
        Object.keys(messages).map((message) => {
          const [timeStamp, text] = messages.get(message);
          return (
            <div>
              {timeStamp.toString()} : {text}
            </div>
          );
        })}
    </main>
  );
}
