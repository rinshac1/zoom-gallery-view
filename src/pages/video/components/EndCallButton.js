/* eslint-disable no-nested-ternary */
import React from "react";
import { Button, Tooltip } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import "./endCallButton.scss";

const EndCallButton = (props) => {
  const { onEndCallClick } = props;
  const tooltipText = "end call";
  return (
    <Tooltip title={tooltipText}>
      <Button
        className="endCall-button"
        icon={<PhoneOutlined />}
        ghost
        shape="circle"
        size="large"
        onClick={onEndCallClick}
      />
    </Tooltip>
  );
};

export default EndCallButton;
