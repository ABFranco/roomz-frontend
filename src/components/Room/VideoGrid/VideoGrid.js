import React, { useState, useEffect } from 'react';
import Video from '../../Video';
import './VideoGrid.css';

function VideoGrid(props) {
  const [width, setWidth] = useState('100vw');

  useEffect(() => {
    // update width of each video based on number of clients
    let numStreams = props.roomMediaStreams.length;
    
    if (numStreams <= 2) {
      setWidth((100/numStreams).toString() + 'vw');
    } else if (numStreams <= 4) {
      setWidth('50vw');
    } else if (numStreams <= 9) {
      setWidth((100/3).toString() + 'vw');
    } else {
      setWidth('25vw');
    }
  }, [props.roomMediaStreams]);


  return (
    <div className="room-video-grid">
      {props.roomMediaStreams.map((v, index) => (
        <Video
          key={index}
          stream={v.stream}
          peerId={v.peerId}
          muted={v.muted}
          width={width}
          />
      ))}
    </div>
  )
}

export default VideoGrid;