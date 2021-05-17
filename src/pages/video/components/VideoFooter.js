import { useState, useEffect, useCallback, useContext } from "react";

import "antd/dist/antd.css";

import ZoomContext from "../../../context/zoom-context";
import ZoomMediaContext from "../../../context/media-context";
import MicrophoneButton from "./MicrophoneButton";
import CameraButton from "./CameraButton";
import EndCallButton from "./EndCallButton";
import { useUnmount } from "../hooks/useUnmount";

import "./video-footer.scss";

const VideoFooter = () => {
  
  const [isStartedVideo, setIsStartedVideo] = useState(false);
  const [isStartedAudio, setIsStartedAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const zmClient = useContext(ZoomContext);
  const { mediaStream } = useContext(ZoomMediaContext);

  const onCameraClick = useCallback(async () => {
    if (isStartedVideo) {
      await mediaStream?.stopVideo();
      setIsStartedVideo(false);
    } else {
      await mediaStream?.startVideo();
      setIsStartedVideo(true);
    }
  }, [mediaStream, isStartedVideo]);

  const onMicrophoneClick = useCallback(async () => {
    if (isStartedAudio) {
      if (isMuted) {
        await mediaStream?.unmuteAudio();
        setIsMuted(false);
      } else {
        await mediaStream?.muteAudio();
        setIsMuted(true);
      }
    } else {
      await mediaStream?.startAudio();
      setIsStartedAudio(true);
    }
  }, [mediaStream, isStartedAudio, isMuted]);

  const onEndCallClick = useCallback(async () => {
    zmClient.leave();
  }, [zmClient]);

  zmClient.on("auto-play-audio-failed", () => {
    console.log("auto play failed, waiting user interaction");
  });

  useEffect(() => {
    onCameraClick();
  }, []);

  useUnmount(() => {
    if (isStartedAudio) {
      mediaStream?.stopAudio();
    }
    if (isStartedVideo) {
      mediaStream?.stopVideo();
    }
  });
  return (
    <div className="video-footer">
      <MicrophoneButton
        isStartedAudio={isStartedAudio}
        isMuted={isMuted}
        onMicrophoneClick={onMicrophoneClick}
      />
      <CameraButton
        isStartedVideo={isStartedVideo}
        onCameraClick={onCameraClick}
      />
      <EndCallButton onEndCallClick={onEndCallClick} />
    </div>
  );
};

export default VideoFooter;
