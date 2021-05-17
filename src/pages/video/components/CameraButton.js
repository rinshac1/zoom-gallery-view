import React from 'react';
import { Button, Tooltip } from 'antd';
import { VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './camera.scss';

const CameraButton = (props) => {
  const { isStartedVideo, onCameraClick, className } = props;
  return (
    <Tooltip title={`${isStartedVideo ? 'stop camera' : 'start camera'}`}>
      <Button
        className={classNames('camere-button', className)}
        icon={isStartedVideo ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}W
        ghost={true}
        shape="circle"
        size="large"
        onClick={onCameraClick}
      />
    </Tooltip>
  );
};
export default CameraButton;
