import React, { useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../RoomForm.css';

import { joinRoom } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { setRoomUserName, setJoinedRoom, clearRoomData, roomJoinCancel  } from '../../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../../reducers/ChatroomSlice';
import { setVestibuleJoin, clearVestibuleData } from '../../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';

function RoomJoin() {
  const dispatch = useDispatch();
  
  const history = useHistory();

  const joinRoomId = useRef();
  const joinRoomPassword = useRef();
  const joinRoomName = useRef();


  /**
   * @function roomJoinSubmit - submit form to join a room
   */
  async function roomJoinSubmit() {
    let roomId, roomPassword, userName;

    try {
      roomId = joinRoomId.current.value;
      roomPassword = joinRoomPassword.current.value;
      userName = joinRoomName.current.value;
        
      if (roomId === '') {
        throw new Error('Enter a Room ID');
      } else if (roomPassword === '') {
        throw new Error('Enter a Room Password');
      } else if (userName === '') {
        throw new Error('Enter a personal Name');
      }
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      return;
    }

    let data = {
      roomId: roomId,
      roomPassword: roomPassword,
      userName: userName,
      userId: store.getState().user.userId,
      isGuest: store.getState().user.userId == null,
    };

    // reset room data, add userName to state
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    dispatch(clearVestibuleData());
    dispatch(setRoomUserName(userName));

    try {
      // TODO: relocate joinRoom into vestibuleSlice?
      const joinRoomResponseStream = await joinRoom(data);

      // stream listeners
      joinRoomResponseStream.on('data', (response) => {
        // update vestibule state
        let vestibulePayload = {
          roomId: roomId,
          roomPassword: roomPassword,
          userName: userName,
        };
        dispatch(setVestibuleJoin(vestibulePayload));
        history.push(`/vestibule/${roomId}`);
        // receiveJoinRoomResponse(response);
      });

      joinRoomResponseStream.on('error', (err) => {
        console.log(':RoomForm.roomJoinSubmit: Stream error: %o', err);
        let errorMessage = 'An unexpected error has occurred when joining a Room.';
        if (err && 'message' in err) {
          errorMessage = err['message'];
        }
        dispatch(setErrorMessage(errorMessage));
      });

      joinRoomResponseStream.on('end', () => {
        console.log(':RoomForm.roomJoinSubmit: Stream ended.');
      });

    } catch (err) {
      console.log(':RoomJoin.roomJoinSubmit: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when joining a Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /**
   * @function cancelRoomJoin - cancel join request when waiting for host acceptance
   */
  async function cancelRoomJoin() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    // set state to leave room
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    dispatch(clearVestibuleData());

    try {
      const response = await dispatch(roomJoinCancel(data));
      if ('error' in response) {
        throw response['error'];
      }

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
    dispatch(clearRoomData());
    dispatch(clearVestibuleData());
  }


  function keyboardCreateJoin(event) {
    // handle keyboard input
    if (event.key === 'Enter') {
      roomJoinSubmit();
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
        <Link to="/">
        <button className="room-form-btn button-secondary" onClick={leaveRoomJoinForm}>Cancel</button>
        </Link>
        <button className="room-form-btn button-primary" onClick={roomJoinSubmit}>Join</button>
      </div>
    );
  }

  function view() {
    return (
      <div className="room-container" onKeyPress={keyboardCreateJoin}>
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