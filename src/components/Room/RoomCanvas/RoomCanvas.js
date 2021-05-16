import React from 'react';

import './RoomCanvas.css';

import VideoGrid from '../VideoGrid';
import Chatroom from '../Chatroom';
import JoinRequests from '../JoinRequests';

function RoomCanvas() {

  return (
    <div className="room-canvas">
      <JoinRequests />
      <VideoGrid />
      <Chatroom />
    </div>
  )
}

export default RoomCanvas;