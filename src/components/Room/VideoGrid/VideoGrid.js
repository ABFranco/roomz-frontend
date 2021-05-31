import React from 'react';
import Video from '../../Video';
import './VideoGrid.css';

function VideoGrid(props) {
  return (
    <div className="room-video-grid">
      {/* {props.videos.map((v, index) => (
        <Video
          key={index}
          stream={v.stream}
          peerId={v.peerId}
          muted={v.muted}
          />
      ))} */}
    </div>
  )
}

export default VideoGrid;