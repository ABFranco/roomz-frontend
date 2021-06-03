import React, { useEffect } from 'react';
import { Link, useHistory, Switch, Route } from 'react-router-dom';
import './Room.css';

import Vestibule from '../Vestibule';
import RoomCanvas from './RoomCanvas';
import RoomBottomPanel from './RoomBottomPanel';
import RoomForm from '../RoomForm';

import { joinRoom, awaitRoomClosure } from '../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';

import { setJoinedRoom, setRoomUserName, clearRoomData } from '../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../reducers/ChatroomSlice';
import { setVestibuleJoin, clearVestibuleData } from '../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../reducers/NotificationSlice';

import store from '../../store';


function Room() {
  const dispatch = useDispatch();
  const userInRoom = useSelector(state => (state.room.userInRoom !== false));
  const inVestibule = useSelector(state => (state.vestibule.roomId !== null));
  const history = useHistory();

  useEffect(() => {
    // this should only occur once when a non-host
    if (!store.getState().room.userIsHost) {
      joinRoomClosureStream();
    }
  },[]);


  /**
   * @function roomLeaveInvalid - room participant is in an invalid room url and exits
   */
  function roomLeaveInvalid() {
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    history.push('/');
  }


  /**
   * @function joinRoomClosureStream - If non-host, join stream to detect when host closes the room
   */
  async function joinRoomClosureStream() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().room.userId,
      token: store.getState().room.token,
    };
    console.log(':Room.joinRoomClosureStream: Attempting to join closure stream with data=%o', data);

    try {
      const closureStream = await awaitRoomClosure(data);
      
      closureStream.on('data', (data) => {
        dispatch(clearRoomData());
        dispatch(clearChatHistory());
        history.push('/');
      });

      closureStream.on('end', () => {
        console.log(':Room.joinRoomClosureStream: Stream ended.');
      });

    } catch (err) {
      console.log(':Room.joinRoomClosureStream: Failed to receive closure stream. err=%o', err);
    }
  }


  /**
   * @function roomJoinSubmit - submit form to join a room
   */
   async function roomJoinSubmit(joinRoomId, joinRoomPassword, joinRoomName) {
    let roomId, roomPassword, userName;

    try {
      roomId = joinRoomId;
      roomPassword = joinRoomPassword;
      userName = joinRoomName;
        
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

      // update vestibule state
      let vestibulePayload = {
        roomId: roomId,
        roomPassword: roomPassword,
        userName: userName,
      };
      dispatch(setVestibuleJoin(vestibulePayload));
      history.push(`/room/${roomId}`);

      // stream listeners
      joinRoomResponseStream.on('data', (response) => {
        receiveJoinRoomResponse(response);
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
   * @function receiveJoinRoomResponse - response after requesting to join a Room
   * @param {Object} response 
   */
   function receiveJoinRoomResponse(response) {
    let roomId = response.getRoomId();
    let status = response.getStatus();

    if (status === 'accept') {
      let vestibulePayload = {
        roomId: roomId,
        roomPassword: null,
        userName: null,
      };
      dispatch(setVestibuleJoin(vestibulePayload));

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
      // setVestibuleStatus('Enter Room ID: ' + roomId);

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

  function invalidRoom() {
    return (
      <div className="room-container">
        <div className="invalid-room">
          <h2>Invalid Room Id</h2>
        </div>
        <Link to="/">
          <button className="room-form-btn button-secondary" onClick={roomLeaveInvalid}>Return Home</button>
        </Link>
      </div>
    );
  }

  function view() {
    if (inVestibule) {
      return (
        <Vestibule />
      );
      
    } else if (userInRoom) {
      return (
        <div className="room-container">
          <RoomCanvas />
          <RoomBottomPanel />
        </div>
      );
    } else {
      return (
        <Switch>
          <Route path="/room/create">
              <RoomForm />
            </Route>
            <Route path="/room/join">
              <RoomForm roomJoinSubmit={roomJoinSubmit}/>
            </Route>
            <Route path="/room/:roomId">
              {invalidRoom}
            </Route>
        </Switch>
      );
    }
  }

  return view();
}

export default Room;