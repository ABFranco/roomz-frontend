import React from 'react';
import { useHistory } from 'react-router-dom';

import '../Room.css';
import './RoomBottomPanel.css';
import IconButton from '@material-ui/core/IconButton';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ChatIcon from '@material-ui/icons/Chat';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ShareIcon from '@material-ui/icons/Share';


import { useDispatch } from 'react-redux';
import { clearChatHistory, toggleChatroom } from '../../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import { roomDelete, roomLeave } from '../../../reducers/RoomSlice';
import { setVisible, updateJoinRequests, clearJoinRequests } from '../../../reducers/JoinRequestsSlice';

import store from '../../../store';

function RoomBottomPanel(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * @function roomLeaveAsNonHost - non-host leaves the room
   */
   async function roomLeaveAsNonHost() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    console.log(':Room.roomLeave: Leaving room with data=%o', data);

    try {
      props.leaveMediaRoom();
      console.log('Successfully left RSS roomId=%o', data["roomId"]);

      const response = await dispatch(roomLeave(data));
      if ('error' in response) {
        throw response['error'];
      }
      console.log('Successfully left RAS roomId=%o', data["roomId"]);
      history.push('/');

    } catch (err) {
      console.log(':RoomForm.roomLeaveAsNonHost: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when leaving the Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /**
  * @function roomDeleteAsHost - Host closes the Room
  */
    async function roomDeleteAsHost() {
    let data = {
      roomId: store.getState().room.roomId,
    };

    try {
      props.leaveMediaRoom();
      console.log('Successfully left RSS roomId=%o', data["roomId"]);

      const response = await dispatch(roomDelete(data));
      if ('error' in response) {
        throw response['error'];
      }
      console.log('Successfully deleted RAS roomId=%o', data["roomId"]);

      dispatch(clearJoinRequests());
      history.push('/');

    } catch (err) {
      console.log(':RoomForm.roomDelete: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when closing the Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }

  /**
   * @function refreshJoinRequests - retrieve the current join requests that are pending
   */
   async function refreshJoinRequests() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    try {
      dispatch(updateJoinRequests(data));

    } catch (err) {
      console.log(':updateJoinRequests: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when retrieving join requests.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /** 
   * @function requestsViewClick - open/close requests window
   */ 
   function requestsViewClick() {
    refreshJoinRequests();
    dispatch(setVisible(true));
  }


  /** 
   * @function toggleChatroomClick - open/close chatroom
   */ 
  function toggleChatroomClick() {
    dispatch(toggleChatroom());
  }

  /**
   * @function toggleAudio - toggle local user's audio
   */
  function toggleAudio() {
    console.log('Toggling local audio stream in roomId=%o', store.getState().room.roomId)
    // let toggleAudioData = {
    //   'action': 'ToggleAudioStream',
    // }
    // props.dispatchMediaStreams(toggleAudioData);
    // console.log('toggled')
    // return;
    props.toggleAudio();
  }

  /**
   * @function toggleVideo - toggle local user's video
   */
  function toggleVideo() {
    console.log('Toggling local video stream in roomId=%o', store.getState().room.roomId)
    // let toggleVideoData = {
    //   'action': 'ToggleVideoStream',
    // }
    // props.dispatchMediaStreams(toggleVideoData);
    props.toggleVideo();
  }


  function roomShare() {
    // TODO
    return;
  }

  function strictActions() {
    if (store.getState().room.userIsHost && store.getState().room.isStrict) {
      return (
        <div className="room-strict-actions">
          <IconButton aria-label="join requests" onClick={requestsViewClick}>
            <GroupAddIcon />
          </IconButton>
          </div>
      );
    }
  }

  function panelActions() {
    if (store.getState().room.userIsHost) {
      return (
        <div className="room-bottom-panel-actions">
          <IconButton aria-label="toggle mic" onClick={toggleAudio}>
            <MicIcon />
          </IconButton>
          <IconButton aria-label="toggle video" onClick={toggleVideo}>
            <VideocamIcon />
          </IconButton>
          <IconButton aria-label="close room" onClick={roomDeleteAsHost}>
            <CallEndIcon />
          </IconButton>
        </div>
      );
    } else {
      return (
        <div className="room-bottom-panel-actions">
          <IconButton aria-label="toggle mic" onClick={toggleAudio}>
              <MicIcon />
            </IconButton>
            <IconButton aria-label="toggle video" onClick={toggleVideo}>
              <VideocamIcon />
            </IconButton>
          <IconButton aria-label="leave room" onClick={roomLeaveAsNonHost}>
            <CallEndIcon />
          </IconButton>
        </div>
      );
    }
  }

  return (
    <div className="room-bottom-panel">
      <div className="room-desc">
        <p><b>Room ID: </b>{store.getState().room.roomId}</p>
        <p><b>Your name: </b>{store.getState().room.roomUserName}</p>
      </div>
      <div className="room-actions">
        {strictActions()}
        {panelActions()}
        <div className="room-actions-right">
          <IconButton aria-label="share" onClick={roomShare}>
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="chatroom toggle" onClick={toggleChatroomClick}>
            <ChatIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default RoomBottomPanel;