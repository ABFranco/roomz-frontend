import React, { useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { joinRoom } from '../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { setJoinedRoom, clearRoomData, roomJoinCancel, roomDelete  } from '../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../reducers/ChatroomSlice';
import { setVestibuleJoin, clearVestibuleData } from '../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../reducers/NotificationSlice';
import store from '../../store';

function Vestibule() {
  const dispatch = useDispatch();
  const isWaiting = useSelector(state => (state.vestibule.roomId && state.vestibule.roomPassword && state.vestibule.userName));
  const isHost = useSelector(state => state.room.userIsHost);

  const history = useHistory();

  const [vestibuleStatus, setVestibuleStatus] = useState('Pending host acceptance...');

  useEffect(() => {
    // upon initial load, determine if the user is still waiting for host response based on cache
    if (isWaiting) {
      reattemptRoomJoinSubmit();
    } else {
      setVestibuleStatus('Enter Room ID: ' + store.getState().room.roomId);
    }
  }, []);


  /**
   * @function reattemptRoomJoinSubmit - reattmpet to join the room again
   */
  async function reattemptRoomJoinSubmit() {

    let data = {
      roomId: store.getState().vestibule.roomId,
      roomPassword: store.getState().vestibule.roomPassword,
      userName: store.getState().vestibule.userName,
      userId: store.getState().user.userId,
      isGuest: store.getState().user.userId == null,
    };

    try {
      const joinRoomResponseStream = await joinRoom(data);

      joinRoomResponseStream.on('data', (response) => {
        receiveJoinRoomResponse(response);
      });

    } catch (err) {
      let errorMessage = 'An unexpected error has occurred when joining a Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }
   

  
  /**
   * @function receiveJoinRoomResponse - response after requesting to join a Room
   * @param {Object} response 
   */
  function receiveJoinRoomResponse(response) {
    let roomId = response.getRoomId();
    let status = response.getStatus();

    if (status === 'accept') {
      dispatch(clearVestibuleData());
      
      // cleanup chatHistory json
      let chatHistory = response.getChatHistoryList();

      let chatHistoryData = [];
      for (let i = 0; i < chatHistory.length; i++) {
        chatHistoryData.push({
          userId: chatHistory[i].getUserId(),
          name: chatHistory[i].getUserName(),
          message: chatHistory[i].getMessage(),
          timestamp: chatHistory[i].getTimestamp(),
        });
      }
      dispatch(setChatHistory(chatHistoryData));

      // update state to allow entering room
      let payload = {
        roomId: roomId,
        token: response.getToken(),
        isStrict: false, // TODO: does this matter?
      }
      dispatch(setJoinedRoom(payload));
      setVestibuleStatus('Enter Room ID: ' + roomId);

    } else if (status === 'wait') {
      console.log(':Vestibule.receiveJoinRoomResponse: Detected wait room');
    } else if (status === 'reject') {
      console.warn(':Vestibule.receiveJoinRoomResponse: Failed to join room.');
      dispatch(setErrorMessage('Failed to join room.'));
    } else {
      console.warn(':Vestibule.receiveJoinRoomResponse: Unknown error.');
      dispatch(setErrorMessage('Unknown error.'));
    }
  }
  

  /**
   * @function enterRoom - upon host acceptance, enter the room
   */
  async function enterRoom() {
    let token = store.getState().room.token;

    if (token !== null) {
      let roomId = store.getState().room.roomId;
      history.push(`/room/${roomId}`);
    } else {
      dispatch(setErrorMessage('You do not yet have access to join the room.'));
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
      console.log(':Vestibule.cancelRoomJoin: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when cancelling Room join.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /**
   * @function roomDeleteAsHost - Host closes the Room if leaving Vestibule
   */
  async function roomDeleteAsHost() {
    let data = {
      roomId: store.getState().room.roomId,
    };

    try {
      const response = await dispatch(roomDelete(data));
      if ('error' in response) {
        throw response['error'];
      }

      dispatch(clearChatHistory());
      history.push('/');

    } catch (err) {
      let errorMessage = 'An unexpected error has occurred when closing the Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  /**
   * @function cancelVestibule - cancel button clicked in Vestibule
   */
  function cancelVestibule() {
    if (isHost) {
      roomDeleteAsHost();
    } else {
      cancelRoomJoin();
    } 
  }


  function waitingRoom() {
    if (isWaiting) {
      return (
        <div className="room-joining-strict">
          <div className="room-header">
            <h1>Joining Room</h1>
          </div>
  
          <p className="room-id-label"><b>Room ID: </b>{store.getState().vestibule.roomId}</p>
          <h2>{ vestibuleStatus }</h2>
  
          <div className="room-actions">
            <Link to="/">
              <button className="room-form-btn button-secondary" onClick={cancelVestibule}>Cancel</button>
            </Link>
            <button className="room-form-btn button-primary" onClick={enterRoom}>Enter</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="room-joining-strict">
          <div className="room-header">
            <h1>{ vestibuleStatus }</h1>
          </div>
  
          <div className="room-actions">
            <Link to="/">
              <button className="room-form-btn button-secondary" onClick={cancelVestibule}>Cancel</button>
            </Link>
            <button className="room-form-btn button-primary" onClick={enterRoom}>Enter</button>
          </div>
        </div>
      )
    }
  }

  function view() {
    return (
      <div className="room-container">
        {waitingRoom()}
      </div>
    );
  }

  return view();
}

export default Vestibule;