// We must define our reducer in this file to prevent double-execution.


/**
  * @function toggleMediaTracks - enables or disables audio or video tracks on a media stream.
  * @param {HTMLMediaElement} stream - A media stream.
  * @param {bool} isAudio - If the media stream is of audio type.
  */
function toggleMediaTracks(stream, isAudio) {
  if (stream === null) {
    console.log('Invalid video stream, cannot toggle media.');
    return;
  }
  let localMediaTracks = stream.getVideoTracks();
  let mediaType = 'video';
  if (isAudio) {
    mediaType = 'audio';
    localMediaTracks = stream.getAudioTracks();
  }
  if (localMediaTracks.length > 0) {
    // Disable or re-enable tracks on local stream.
    console.log('Toggling %o tracks from local stream', mediaType);
    for (let i = 0; i < localMediaTracks.length; i++) {
      console.log('Setting %o track enabled to=%o', mediaType, !localMediaTracks[i].enabled);
      localMediaTracks[i].enabled = !localMediaTracks[i].enabled;
    }
  } else {
    console.log('No registered %o tracks on stream!', mediaType);
  }
}

/**
  * @function toggleAudio - Add Video Stream appends a peer's video stream data to the array of
  * video streams passed via props to the Grid component.
  * @param {HTMLMediaElement[]} prevRoomMediaStreams - An array of room media streams.
  * @param {Object} actionObject - A payload object used to determine which actions are performed to media streams.
  */
function editMediaStream(prevRoomMediaStreams, actionObject) {
  console.log('editMediaStream, data=%o', actionObject);
  let newRoomMediaStreams = null;
  switch(actionObject.action) {
    case 'AddStream':
      console.log('Adding new media stream to grid for peerId=%o', actionObject.peerId);
      newRoomMediaStreams = [...prevRoomMediaStreams, actionObject];
      return newRoomMediaStreams;

    case 'RemoveStream':
      console.log('Removing media stream from grid');
      newRoomMediaStreams = [...prevRoomMediaStreams];
      for (let i = 0; i < newRoomMediaStreams.length; i++) {
        if (newRoomMediaStreams[i].peerId === actionObject.removePeerId) {
          console.log('Removed media stream for peerId=%o', actionObject.removePeerId);
          newRoomMediaStreams.splice(i, 1);
          break;
        }
      }
      return newRoomMediaStreams;

    case 'ToggleAudioStream':
      console.log('Toggling mute auto on local stream');
      newRoomMediaStreams = [...prevRoomMediaStreams];
      if (newRoomMediaStreams.length > 0) {
        // Toggle mute on local video div.
        // newRoomMediaStreams[0].muted = !newRoomMediaStreams[0].muted;
        // Also toggle audio tracks on outgoing local stream.
        toggleMediaTracks(newRoomMediaStreams[0].stream, true);
      }
      return newRoomMediaStreams;

    case 'ToggleVideoStream':
      console.log('Toggling mute video on local stream');
      newRoomMediaStreams = [...prevRoomMediaStreams];
      if (newRoomMediaStreams.length > 0) {
        // Toggle video tracks on local stream.
        toggleMediaTracks(newRoomMediaStreams[0].stream, false);
      }
      console.log('newRoomMediaStreams=%o', newRoomMediaStreams);
      return newRoomMediaStreams;

    default:
      console.log('Incorrect action for editMediaStream');
      return prevRoomMediaStreams;
  }
}


export { editMediaStream }