import React from 'react';

import './RoomCanvas.css';

import VideoGrid from '../VideoGrid';
import Chatroom from '../Chatroom';
import JoinRequests from '../JoinRequests';

function RoomCanvas(props) {

  return (
    <div className="room-canvas">
      <JoinRequests />
      <VideoGrid
        roomMediaStreams={props.roomMediaStreams}/>
      <Chatroom />
    </div>
  )
}

export default RoomCanvas;