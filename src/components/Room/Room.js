import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Room.css';

import RoomCanvas from './RoomCanvas';
import RoomBottomPanel from './RoomBottomPanel';

import { awaitRoomClosure } from '../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { clearRoomData } from '../../reducers/RoomSlice';
import { clearChatHistory } from '../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../reducers/NotificationSlice';

import store from '../../store';

function Room() {
  const dispatch = useDispatch();
  const userInRoom = useSelector(state => (state.room.userInRoom !== null));
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

  function view() {
    if (userInRoom) {
      return (
        <div className="room-container">
          <RoomCanvas />
          <RoomBottomPanel />
        </div>
      );
    } else {
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
  }

  return view();
}

export default Room;