import React, { useState } from "react";

import ZoomMtgCm from "@zoomus/instantsdk";
import "antd/dist/antd.css";

import ZoomContext from "./context/zoom-context";
import { generateSignature } from "./utils/util";
import { devConfig } from "./config/dev";
import ZoomSession from "./pages/ZoomSession";

import "./App.css";

function App() {
  const [topic, setTopic] = useState(null);
  const [userName, setUserName] = useState(null);
  const [joined, setJoined] = useState(false);

  let meetingArgs = devConfig;
  const zmClient = ZoomMtgCm.createClient();

  const topicChangeHandler = (event) => {
    setTopic(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setUserName(event.target.value);
  };

  const onJoinClick = () => {
    meetingArgs.topic = topic;
    meetingArgs.name = userName;
    if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
      meetingArgs.signature = generateSignature(
        meetingArgs.sdkKey,
        meetingArgs.sdkSecret,
        meetingArgs.topic,
        meetingArgs.password
      );
    }
    setJoined(true);
  };

  return (
    <React.Fragment>
      {!joined && (
        <header>
          <label>Topic:</label>
          <input type="text" onChange={topicChangeHandler} />
          <label>Name:</label>
          <input type="text" onChange={nameChangeHandler} />
          <button onClick={onJoinClick}>join</button>
        </header>
      )}
      {joined && (
        <ZoomContext.Provider value={zmClient}>
          <ZoomSession meetingArgs={meetingArgs} />
        </ZoomContext.Provider>
      )}
    </React.Fragment>
  );
}

export default App;
