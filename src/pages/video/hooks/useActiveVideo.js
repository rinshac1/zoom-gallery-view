import { useState, useCallback, useEffect } from "react";

export function useActiveVideo(zmClient) {

  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const onActiveSpeakerChange = useCallback((payload) => {
    if (Array.isArray(payload) && payload.length > 0) {
      const { userId } = payload[0];
      setActiveSpeaker(userId);
    }
  }, []);
  useEffect(() => {
    zmClient.on("active-speaker", onActiveSpeakerChange);
    return () => {
      zmClient.off("active-speaker", onActiveSpeakerChange);
    };
  }, [zmClient, onActiveSpeakerChange]);
  return activeSpeaker;
}
