import React, { useEffect, useContext, useRef } from "react";

import ZoomContext from "../../context/zoom-context";
import ZoomMediaContext from "../../context/media-context";
import VideoFooter from "./components/VideoFooter";
import { useMultiParticipantsLayout } from "./hooks/useMultiParticipantsLayout";
import { useActiveVideo } from "./hooks/useActiveVideo";
import "./video.scss";

import { Avatar } from "antd";
import "antd/dist/antd.css";
import zoomContext from "../../context/zoom-context";

const VideoContainer = (props) => {
  const zmClient = useContext(ZoomContext);

  const {
    mediaStream,
    video: { decode: isVideoDecodeReady },
  } = useContext(ZoomMediaContext);

  const viewportRef = useRef(null);
  const videoRefMain = useRef(null);

  useEffect(() => {
    videoRefMain.current.height = viewportRef.current.offsetHeight;
    videoRefMain.current.width = viewportRef.current.offsetWidth;
  }, []);

  const activeSpeaker = useActiveVideo(zmClient);

  const { visibleParticipants } = useMultiParticipantsLayout(
    zmClient,
    mediaStream,
    isVideoDecodeReady,
    videoRefMain,
    activeSpeaker
  );
  console.log("visibleParticipants" + visibleParticipants);

  return (
    <div className="viewport" ref={viewportRef}>
      <div className={"video-container"}>
        <div className="canvas-container-1">
          <canvas
            className="canvas-bottom"
            id="canvas1"
            width="800"
            height="500"
            ref={videoRefMain}
          ></canvas>
        </div>
        <VideoFooter />
        <div>
          {visibleParticipants.map((user, index) => {
            return (
              <Avatar shape="square" size={64}>
                {user.displayName}
              </Avatar>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
