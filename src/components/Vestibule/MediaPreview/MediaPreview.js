import React, { useEffect, useState } from 'react';
import Video from '../../Video';
import Avatar from '@material-ui/core/Avatar';

import './MediaPreview.css';

function MediaPreview() {
  const [stream, setStream] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setupLocalMedia();
  }, [])

  // setupLocalMedia requests access to the user's microphone and webcam and
  // properly sets up the egress media stream.
  // NOTE: This will likely be called on load within the vestibule component.
  function setupLocalMedia() {
    if (stream != null) {
      return
    }
    console.log('Asking for local audio/video inputs')
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
    navigator.getUserMedia({'audio': true, 'video': true},
      function(localStream) {
        console.log('Granted access to audio/video, setting stream.')
        setStream(localStream);
      },
      function() {
        console.log('Access denied for audio/video')
        alert('Have fun being lame on zoom')
      });
  }

  function toggleAudio() {
    setMuted(!muted)
  }
  
  function toggleVideo() {
    if (stream === null) {
      setupLocalMedia()
    } else {
      setStream(null);
    }
  }
  
  return (
    <div className="media-preview">
    {stream !== null
    ? <Video
        stream={stream}
        peerId={peerId}
        muted={true}
        />
    : <div className="media-preview-placeholder"/>}
    <div className="media-btns">
      <Avatar className="avatar-placeholder" onClick={toggleAudio}>A</Avatar>
      <Avatar className="avatar-placeholder" onClick={toggleVideo}>V</Avatar>
    </div>
    </div>
  );
}

export default MediaPreview;