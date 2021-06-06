import React, { useEffect, useState } from 'react';
import Video from '../../Video';
import Avatar from '@material-ui/core/Avatar';

import './MediaPreview.css';

import store from '../../../store';

function MediaPreview(props) {
  const [stream, setStream] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setupLocalMedia();
  }, [])

  /**
   * @function setupLocalMedia - requests access to the user's microphone and
   * webcam and properly sets the egress media stream.
   */
  function setupLocalMedia() {
    if (stream != null) {
      console.log('Local stream already established!')
      return
    }
    console.log('Asking for local audio/video inputs')
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
    navigator.getUserMedia({'audio': true, 'video': true},
      function(localMediaStream) {
        console.log('Granted access to audio/video, setting stream.')
        // props.setLocalMediaStream(localMediaStream)
        setStream(localMediaStream)
        // Add local video stream to Grid.
        let addVideoData = {
          'action': 'AddStream',
          'stream': localMediaStream,
          // NOTE: We are not keeping peerId inside redux for now.
          'peerId': store.getState().room.roomId + "-" + store.getState().user.userId,
          'muted': false,
        }
        props.dispatchMediaStreams(addVideoData)
      },
      function() {
        console.log('Access denied for audio/video')
        alert('Have fun being lame on zoom')
      });
  }

  /**
   * @function toggleAudio - toggles mute on user's audio.
   */
  function toggleAudio() {
    setMuted(!muted)
  }
  
  /**
   * @function toggleAudio - toggles mute on user's video.
   */
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