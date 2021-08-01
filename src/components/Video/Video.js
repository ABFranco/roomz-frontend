import React, { useRef, useEffect } from 'react';

import './Video.css';

function Video(props) {
  const mediaRef = useRef();

  useEffect(() => {
    mediaRef.current.srcObject = props.stream;
  }, [props.stream])

  return (
    <div className="room-video-object-container" id={props.peerId}>
      <video className="room-video-object" ref={mediaRef} id="egress-video" autoPlay muted={props.muted} style={{ width: props.width }}/>
    </div>
  )
}

export default Video;