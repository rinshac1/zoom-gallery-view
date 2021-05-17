import { useCallback, useEffect, useState } from "react";
/**
 * Default order of video:
 *  1. video's participants first
 *  2. self on the second position
 */
export function useMultiParticipantsLayout(
  zmClient,
  mediaStream,
  isVideoDecodeReady,
  videoRefMain,
  activeSpeaker
) {
  const [visibleParticipants, setVisibleParticipants] = useState([]);

  const onParticipantsChange = useCallback(() => {
    console.log(" activeSpeaker iss " + activeSpeaker);
    const participants = zmClient.getAllUser();
    const currentUser = zmClient.getCurrentUserInfo();
    if (currentUser && participants.length > 0) {
      console.log("participants " + participants);
      let pageParticipants = participants;
      setVisibleParticipants(pageParticipants);
      const videoParticipants = pageParticipants
        .filter((user) => user.bVideoOn)
        .map((user) => user.userId);
      const removedSubscribers = pageParticipants
        .filter((user) => !user.bVideoOn)
        .map((user) => user.userId);

      console.log("removing video for users " + removedSubscribers);
      if (removedSubscribers.length > 0) {
        removedSubscribers.forEach((userId) => {
          mediaStream?.stopRenderVideo(videoRefMain.current, userId);
          console.log("stop rendering video for " + userId);
        });
      }
      if (videoParticipants.length > 0) {
        let videoRendered = false;
        if (activeSpeaker !== "0") {
          videoParticipants.forEach(async (userId) => {
            if (userId === activeSpeaker) {
              videoRendered = true;
              await mediaStream?.renderVideo(
                videoRefMain.current,
                userId,
                videoRefMain.current.width,
                videoRefMain.current.height,
                0,
                0,
                2
              );
            }
          });
        }

        if (!videoRendered) {
          videoParticipants.forEach(async (userId) => {
            if (userId === currentUser.userId) {
              videoRendered = true;
              await mediaStream?.renderVideo(
                videoRefMain.current,
                userId,
                videoRefMain.current.width,
                videoRefMain.current.height,
                0,
                0,
                2
              );
            }
          });
        }
      }
    }
  }, [zmClient, activeSpeaker]);

  useEffect(() => {
    zmClient.on("user-added", onParticipantsChange);
    zmClient.on("user-removed", onParticipantsChange);
    zmClient.on("user-updated", onParticipantsChange);
    return () => {
      zmClient.off("user-added", onParticipantsChange);
      zmClient.off("user-removed", onParticipantsChange);
      zmClient.off("user-updated", onParticipantsChange);
    };
  }, [zmClient, onParticipantsChange]);
  useEffect(() => {
    onParticipantsChange();
  }, [onParticipantsChange]);

  return {
    visibleParticipants,
  };
}
