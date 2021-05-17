import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useReducer,
} from "react";

import ZoomMtgCm from "@zoomus/instantsdk";
import produce from "immer";
import { message, Modal } from "antd";
import "antd/dist/antd.css";

import ZoomContext from "../context/zoom-context";
import ZoomMediaContext from "../context/media-context";
import LoadingLayer from "../component/loading-layer";
import Video from "./video/Video";

const mediaShape = {
  audio: {
    encode: false,
    decode: false,
  },
  video: {
    encode: false,
    decode: false,
  },
};
const mediaReducer = produce((draft, action) => {
  switch (action.type) {
    case "audio-encode": {
      draft.audio.encode = action.payload;
      break;
    }
    case "audio-decode": {
      draft.audio.decode = action.payload;
      break;
    }
    case "video-encode": {
      draft.video.encode = action.payload;
      break;
    }
    case "video-decode": {
      draft.video.decode = action.payload;
      break;
    }
    default:
      break;
  }
}, mediaShape);

function ZoomSession(props) {
  const {
    meetingArgs: { sdkKey, topic, signature, name, password },
  } = props;
  const [loading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [isFailover, setIsFailover] = useState(false);
  const [mediaState, dispatch] = useReducer(mediaReducer, mediaShape);
  const [mediaStream, setMediaStream] = useState(null);
  const zmClient = useContext(ZoomContext);

  useEffect(() => {
    const init = async () => {
      await zmClient.init("en-US", `${window.location.origin}/lib`);
      try {
        setLoadingText("Joining the session...");
        await zmClient.join(topic, signature, name, password);
        setMediaStream(zmClient.getMediaStream());
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        message.error(e.reason);
      }
    };
    init();
    return () => {
      ZoomMtgCm.destroyClient();
    };
  }, [sdkKey, signature, zmClient, topic, name, password]);

  const onConnectionChange = useCallback(
    (payload) => {
      if (payload.state === "Reconnecting") {
        setIsLoading(true);
        setIsFailover(true);
        const { reason } = payload;
        if (reason === "failover") {
          setLoadingText("Session Disconnected,Try to reconnect");
        }
      } else if (payload.state === "Connected" && isFailover) {
        setIsLoading(false);
      } else if (payload.state === "Closed") {
        Modal.warning({
          title: "Session ended",
          content: "This session has been ended by host",
        });
      }
    },
    [isFailover]
  );

  const onMediaSDKChange = useCallback((payload) => {
    const { action, type, result } = payload;
    dispatch({ type: `${type}-${action}`, payload: result === "success" });
  }, []);

  useEffect(() => {
    zmClient.on("connection-change", onConnectionChange);
    zmClient.on("media-sdk-change", onMediaSDKChange);
    return () => {
      zmClient.off("connection-change", onConnectionChange);
      zmClient.off("media-sdk-change", onMediaSDKChange);
    };
  }, [zmClient, onConnectionChange, onMediaSDKChange]);

  return (
    <div className="App">
      {loading && <LoadingLayer content={loadingText} />}
      {!loading && (
        <ZoomMediaContext.Provider value={{ ...mediaState, mediaStream }}>
          <Video />
        </ZoomMediaContext.Provider>
      )}
    </div>
  );
}

export default ZoomSession;
