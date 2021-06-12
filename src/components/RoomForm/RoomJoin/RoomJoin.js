import React, { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../RoomForm.css';


import { useDispatch } from 'react-redux';
import { clearRoomData, roomJoinCancel  } from '../../../reducers/RoomSlice';
import { clearChatHistory } from '../../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';

function RoomJoin({roomJoinSubmit}) {
  const dispatch = useDispatch();
  
  const history = useHistory();

  const joinRoomId = useRef();
  const joinRoomPassword = useRef();
  const joinRoomName = useRef();


  /**
   * @function handleRoomJoinSubmit - call parent function to join room
   */
  
  async function handleRoomJoinSubmit() {
    roomJoinSubmit(joinRoomId.current.value, joinRoomPassword.current.value, joinRoomName.current.value);
  }


  /**
   * @function cancelRoomJoin - cancel join request when waiting for host acceptance
   */
  async function cancelRoomJoin() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    try {
      const response = await dispatch(roomJoinCancel(data));
      if ('error' in response) {
        throw response['error'];
      }

      history.push('/');

    } catch (err) {
      console.log(':RoomJoin.cancelRoomJoin: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when cancelling Room join.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /**
   * @function leaveRoomJoinForm - leave the join room form
   */
  function leaveRoomJoinForm() {
    history.push('/');
  }


  function keyboardCreateJoin(event) {
    // handle keyboard input
    if (event.key === 'Enter') {
      roomJoinSubmit(joinRoomId.current.value, joinRoomPassword.current.value, joinRoomName.current.value);
    }
  }


  function roomForm() {
    return (
      <form className="room-form">
        <div className="room-form-input">
          <label htmlFor="roomID">Room ID</label>
          <input id="roomID" ref={joinRoomId} type="text" autoFocus autoComplete="on"/>
        </div>
        <div className="room-form-input">
          <label htmlFor="password">Room Password</label>
          <input id="password" ref={joinRoomPassword} type="password" autoComplete="password"/>
        </div>
        <div className="room-form-input">
          <label htmlFor="name">Your Name in the Room</label>
          <input id="name" ref={joinRoomName} type="text" autoComplete="name"/>
        </div>
      </form>
    );
  }

  function roomFormActions() {
    return (
      <div className="room-actions">
        <button className="room-form-btn button-secondary" onClick={leaveRoomJoinForm}>Cancel</button>
        <button className="room-form-btn button-primary" onClick={handleRoomJoinSubmit}>Join</button>
      </div>
    );
  }

  function view() {
    return (
      <div className="room-form-container" onKeyPress={keyboardCreateJoin}>
        <div className="room-header">
          <h1>Join a Room</h1>
        </div>
        {roomForm()}
        {roomFormActions()}
      </div>
    );
  }

  return view();
}

export default RoomJoin;