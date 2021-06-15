import React, { useRef, useEffect } from 'react';

import './Video.css';

function Video(props) {
  const mediaRef = useRef();

  useEffect(() => {
    mediaRef.current.srcObject = props.stream;
  }, [props.stream])

  return (
    <div className="video" id={props.peerId}>
      <video ref={mediaRef} id="egress-video" autoPlay muted={props.muted}/>
    </div>
  )
}

export default Video;