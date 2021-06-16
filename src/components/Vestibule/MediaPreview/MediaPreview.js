import React, { useEffect, useState } from 'react';
import Video from '../../Video';
import Avatar from '@material-ui/core/Avatar';

import './MediaPreview.css';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import store from '../../../store';

function MediaPreview(props) {
  const [stream, setStream] = useState(null);
  const [peerId, setPeerId] = useState("");

  useEffect(() => {
    setupLocalMedia(true);
  }, [])

  /**
   * @function setupLocalMedia - requests access to the user's microphone and
   * webcam and properly sets the egress media stream.
   */
  function setupLocalMedia(addStreamToRoom) {
    if (stream != null) {
      console.log('Local stream already established!');
      return;
    }
    console.log('Asking for local audio/video inputs')
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    
    navigator.getUserMedia({'audio': true, 'video': true},
      function(localMediaStream) {
        console.log('Granted access to audio/video, setting stream.');
        setStream(localMediaStream);

        if (addStreamToRoom) {
          // Add local video stream to Grid.
          let addVideoData = {
            'action': 'AddStream',
            'stream': localMediaStream,
            // NOTE: We are not keeping peerId inside redux for now.
            'peerId': store.getState().room.roomId + "-" + store.getState().user.userId,
            // mute local audio by default to prevent echo
            'muted': true,
          }
          props.dispatchMediaStreams(addVideoData);
        }
      },
      function() {
        console.log('Access denied for audio/video');
        alert('Have fun being lame on zoom');
      });
  }

  /**
   * @function toggleAudio - toggles mute on user's audio.
   */
  function toggleAudio() {
    // mute audio tracks on room stream
    let toggleAudioData = {
      'action': 'ToggleAudioStream',
    }
    props.dispatchMediaStreams(toggleAudioData);
  }
  
  /**
   * @function toggleVideo - toggles mute on user's video.
   */
  function toggleVideo() {
    // toggle video stream so it persists when entering the room
    let toggleVideoData = {
      'action': 'ToggleVideoStream',
    }
    props.dispatchMediaStreams(toggleVideoData);

    // toggle local stream view
    if (stream === null) {
      // do not add a new stream to room, assume that's been populated
      setupLocalMedia(false);
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
      <IconButton aria-label="toggle mic" onClick={toggleAudio}>
        {store.getState().media.audioOn ? <MicIcon /> : <MicOffIcon />}
      </IconButton>
      <IconButton aria-label="toggle video" onClick={toggleVideo}>
        {store.getState().media.videoOn ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>
    </div>
    </div>
  );
}

export default MediaPreview;