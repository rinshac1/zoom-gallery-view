/* eslint-disable no-nested-ternary */
import React from 'react';
import { Button, Tooltip } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import './microphone.scss';

const MicrophoneButton = (props) => {
  const { isStartedAudio, isMuted, onMicrophoneClick } = props;
  const tooltipText = isStartedAudio ? (isMuted ? 'unmute' : 'mute') : 'start audio';
  return (
    <Tooltip title={tooltipText}>
      <Button
        className="microphone-button"
        icon={
          isStartedAudio ? (
            isMuted ? (
              <AudioMutedOutlined />
            ) : (
              <AudioOutlined />
            )
          ) : (
            <AudioMutedOutlined />
          )
        }
        ghost
        shape="circle"
        size="large"
        onClick={onMicrophoneClick}
      />
    </Tooltip>
  );
};

export default MicrophoneButton;
