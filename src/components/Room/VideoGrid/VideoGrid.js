import React, { useState, useEffect } from 'react';
import Video from '../../Video';
import './VideoGrid.css';

function VideoGrid(props) {
  const [width, setWidth] = useState('100vw');

  useEffect(() => {
    // update width of each video based on number of clients
    let numStreams = props.roomMediaStreams.length;
    let viewWidth = (100 / Math.ceil(Math.sqrt(numStreams))).toString() + 'vw';
    // console.log('numStreams=%s, viewWidth=%s', numStreams, viewWidth)
    setWidth(viewWidth);
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