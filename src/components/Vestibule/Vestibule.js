import React, { useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { joinRoom } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { setRoomUserName, setJoinedRoom, clearRoomData, roomJoinCancel  } from '../../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../../reducers/ChatroomSlice';
import { setVestibuleJoin, clearVestibuleData } from '../../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';

function Vestibule() {
  const dispatch = useDispatch();
  const inVestibule = useSelector(state => (state.vestibule.roomId && state.vestibule.roomPassword && state.vestibule.userName));

  const history = useHistory();

  
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
      for (var i = 0; i < chatHistory.length; i++) {
        chatHistoryData.push({
          userId: chatHistory[i].getUserId(),
          name: chatHistory[i].getUserName(),
          message: chatHistory[i].getMessage(),
          timestamp: chatHistory[i].getTimestamp(),
        });
      }
      dispatch(setChatHistory(chatHistoryData));

      // enter the room
      let payload = {
        roomId: roomId,
        token: response.getToken(),
        isStrict: false, // TODO: does this matter?
      }
      dispatch(setJoinedRoom(payload));
      history.push(`/room/${roomId}`);

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
    return (
      <div className="room-container">
        {waitingRoom()}
      </div>
    );
  }

  return view();
}

export default Vestibule;