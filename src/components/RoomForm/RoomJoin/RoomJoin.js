import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../RoomForm.css';
import { joinRoom } from '../../../api/RoomzApiServiceClient.js'

import { useDispatch, useSelector } from 'react-redux';
import { setRoomUserName, setJoinedRoom, setWaitingRoom, clearRoomData, roomJoinCancel  } from '../../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../../reducers/ChatroomSlice';
import store from '../../../store';

function RoomJoin() {
  const dispatch = useDispatch();
  const inWaitingRoom = useSelector(state => (state.room.userIsJoining === true));

  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState(null);

  const joinRoomId = useRef();
  const joinRoomPassword = useRef();
  const joinRoomName = useRef();

  // useEffect(() => {
  //     // upon initial render, retrieve waiting room info in cache
  //     // determine if the user is supposed to be in the waiting room
  //     let cachedInWaitingRoom = getCachedObject('inWaitingRoom');
  //     console.log(':RoomForm: cachedInWaitingRoom=%s', cachedInWaitingRoom)
  //     if (cachedInWaitingRoom !== null) {
  //         // error check against incorrect caching
  //         if (props.roomInfo.userInRoom && cachedInWaitingRoom) {
  //             console.warn(':RoomForm: bad caching! setting inWaitingRoom to false')
  //             setCachedObject('inWaitingRoom', false)
  //             setInWaitingRoom(false)
  //         } else {
  //             console.log(':RoomForm: Setting inWaitingRoom for cachedInWaitingRoom=%s', cachedInWaitingRoom);
  //             setInWaitingRoom(cachedInWaitingRoom);

  //             if (cachedInWaitingRoom) {
  //                 // obtain original form data from cache and re-send another join request
  //                 let cacheData = getCachedObject('joinRoomData');
  //                 console.log(':RoomForm: cacheData=%o', cacheData);
  //                 roomJoinSubmit(cacheData['roomId'], cacheData['roomPassword'], cacheData['userName']);
  //             }

  //         }
  //     }
  // }, [])

  

  /**
   * @function receiveJoinRoomResponse - response after requesting to join a Room
   * @param {Object} response 
   */
  function receiveJoinRoomResponse(response) {
    let roomId = response.getRoomId();
    let status = response.getStatus();

    if (status === 'accept') {
      console.log(':RoomForm.receiveJoinRoomResponse: Accepted, joining room');
      
      // cleanup chatHistory json
      let chatHistory = response.getChatHistoryList();

      let chatHistoryData = [];
      for (var i = 0; i < chatHistory.length; i++) {
        chatHistoryData.push({
          userId: chatHistory[i].getUserId(),
          name: chatHistory[i].getUserName(),
          message: chatHistory[i].getMessage(),
          timestamp: chatHistory[i].getTimestamp()
        });
      }
      dispatch(setChatHistory(chatHistoryData));

      let payload = {
        roomId: roomId,
        token: response.getToken(),
        isStrict: false, // TODO: does this matter?
      }
      dispatch(setJoinedRoom(payload));

      console.log(':RoomForm.receiveJoinRoomResponse: test');
      
      history.push(`/room/${roomId}`)

    } else if (status === 'wait') {
      console.log(':RoomForm.receiveJoinRoomResponse: Detected wait room');

      // edit room info
      let payload = {
        roomId : roomId,
      }
      dispatch(setWaitingRoom(payload));

    } else if (status === 'reject') {
      console.warn(":RoomForm.receiveJoinRoomResponse: Failed to join room.");
      setErrorMessage("Failed to join room.");
    } else {
      console.warn(":RoomForm.receiveJoinRoomResponse: Unknown error.");
      setErrorMessage("Unknown error.");
    }
  }


  /**
   * @function roomJoinSubmit - submit form to join a room
   */
  async function roomJoinSubmit() {

    let data = {
      roomId: joinRoomId.current.value,
      roomPassword: joinRoomPassword.current.value,
      userId: store.getState().user.userId,
      userName: joinRoomName.current.value,
      isGuest: store.getState().user.userId == null,
    }

    // reset room data, add userName to state
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    dispatch(setRoomUserName(joinRoomName.current.value));

    // update user info upon fresh join submit

    // TODO: update store to save data into cache, maybe in vestibuleSlice?
    // let cacheData = {
    //     'roomId'       : roomId,
    //     'roomPassword' : roomPassword,
    //     'userName'     : userName,
    // }
    // setCachedObject('joinRoomData', cacheData);

    console.log(":RoomJoin.roomJoinSubmit: Attempting to join room with data=%o", data);

    try {
      // const response = await dispatch(roomJoin(data));
      // if ('error' in response) {
      //   throw response['error'];
      // }
      const joinRoomResponseStream = await joinRoom(data);

      console.log(':RoomForm.roomJoinSubmit: joinRoomResponseStream=%o', joinRoomResponseStream);

      // stream listeners
      joinRoomResponseStream.on('data', (response) => {
        console.log(':RoomForm.roomJoinSubmit: response=%o', response);

        // TODO: instead of joining room immedietly, go into vestibule
        receiveJoinRoomResponse(response);
          
      });

      joinRoomResponseStream.on('error', (err) => {
        console.log(':RoomForm.roomJoinSubmit: error: %o', err);
        let errorMessage = 'An unexpected error has occurred when joining a Room.';
        if (err && 'message' in err) {
          errorMessage = err['message'];
        }
        setErrorMessage(errorMessage);
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
      setErrorMessage(errorMessage);
    }
  }


  /**
   * @function cancelRoomJoin - cancel join request when waiting for host acceptance
   */
  async function cancelRoomJoin() {
    let data = {
        roomId: store.getState().room.roomId,
        userId: store.getState().user.userId,
    }

    console.log(':RoomForm.cancelRoomJoin: Cancelling join request with data=%o', data);

    try {
      const response = await dispatch(roomJoinCancel(data));
      if ('error' in response) {
        throw response['error'];
      }
      console.log(':RoomForm.cancelRoomJoin: Success, response=%o', data);

      // set state to leave room
      dispatch(clearRoomData());
      dispatch(clearChatHistory());

    } catch (err) {
      console.log(':RoomJoin.cancelRoomJoin: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when cancelling Room join.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  function keyboardCreateJoin(event) {
      // handle keyboard input
      if (event.key === "Enter") {
          if (!inWaitingRoom) {
            roomJoinSubmit();
          }
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
    )   
  }

  function errorMessageDisplay() {
    if (errorMessage) {
      return (
        <div className="room-submit-error-area">
          <p className="room-submit-error-msg">{errorMessage}</p>
        </div>
      )
    }
  }


  function roomFormActions() {
    return (
      <div className="room-actions">
        <Link to="/">
        <button className="room-form-btn button-secondary">Cancel</button>
        </Link>
        <button className="room-form-btn button-primary" onClick={roomJoinSubmit}>Join</button>
      </div>
    )   
  }

  function waitingRoom() {
    return (
      <div className="room-joining-strict">
        <div className="room-header">
          <h1>Joining Room</h1>
        </div>

        <p className="room-id-label"><b>Room ID: </b>{store.getState().room.roomId}</p>
        <h2>Pending host acceptance...</h2>

        <div className="room-actions">
          <Link to="/">
            <button className="room-form-btn button-secondary" onClick={cancelRoomJoin}>Cancel</button>
          </Link>
        </div>
      </div>
    )
  }

  function view() {
    if (inWaitingRoom) {
      return (
        <div className="room-container">
          {waitingRoom()}
        </div>
      )
    }  else {
      return (
        <div className="room-container" onKeyPress={keyboardCreateJoin}>
          <div className="room-header">
            <h1>Join a Room</h1>
          </div>
          {roomForm()}
          {errorMessageDisplay()}
          {roomFormActions()}
        </div>
      )
    }
  }

  return view();
}

export default RoomJoin;