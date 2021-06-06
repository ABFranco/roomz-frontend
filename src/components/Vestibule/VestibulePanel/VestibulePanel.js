import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './VestibulePanel.css';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import { clearRoomData, roomJoinCancel, roomDelete, roomLeave } from '../../../reducers/RoomSlice';
import { clearChatHistory } from '../../../reducers/ChatroomSlice';
import { clearVestibuleData } from '../../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';

function VestibulePanel() {
  const dispatch = useDispatch();
  const isWaiting = useSelector(state => (state.vestibule.roomId && state.vestibule.roomPassword && state.vestibule.userName));
  const isHost = useSelector(state => state.room.userIsHost);

  const history = useHistory();

  const [vestibuleStatus, setVestibuleStatus] = useState('');

  useEffect(() => {
    if (isWaiting) {
      setVestibuleStatus('Pending host acceptance...');
    } else {
      setVestibuleStatus('Enter Room ID: ' + store.getState().room.roomId);
    }
  }, [isWaiting]);
  

  /**
   * @function enterRoom - upon host acceptance, enter the room
   */
  async function enterRoom() {
    let token = store.getState().room.token;
    
    if (token !== null) {
      dispatch(clearVestibuleData());
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
   * @function roomLeaveAsNonHost - non-host leaves the room if leaving Vestibule
   */
  async function roomLeaveAsNonHost() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    try {
      const response = await dispatch(roomLeave(data));
      if ('error' in response) {
        throw response['error'];
      }

      dispatch(clearChatHistory());
      history.push('/');

    } catch (err) {
      let errorMessage = 'An unexpected error has occurred when leaving the Room.';
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
    } else if (isWaiting) {
      cancelRoomJoin();
    } else {
      roomLeaveAsNonHost();
    }
  }

  /**
   * @function getRoomUserNameChar - get first char of Room UserName
   */
   function getRoomUserNameChar() {
    return store.getState().room.roomUserName.substring(0, 1);
  }


  function waitingRoom() {
    if (isWaiting) {
      return (
        <div className="vestibule-waiting">
          <Avatar className="avatar-placeholder">{getRoomUserNameChar()}</Avatar>

          <div className="vestibule-header">
            <h1>Joining Room ID: {store.getState().vestibule.roomId}</h1>
          </div>
          <CircularProgress className="vestibule-loading"/>
          <p>{ vestibuleStatus }</p>
  
          <div className="vestibule-actions">
            <Link to="/">
              <button className="button-secondary" onClick={cancelVestibule}>Cancel</button>
            </Link>
            <button className="button-primary" onClick={enterRoom}>Enter</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="vestibule-ready">
          <Avatar className="avatar-placeholder">{getRoomUserNameChar()}</Avatar>

          <div className="vestibule-header">
            <h1>{ vestibuleStatus }</h1>
          </div>
  
          <div className="vestibule-actions">
            <Link to="/">
              <button className="button-secondary" onClick={cancelVestibule}>Cancel</button>
            </Link>
            <button className="button-primary" onClick={enterRoom}>Enter</button>
          </div>
        </div>
      )
    }
  }

  function view() {
    return (
      <div className="vestibule-panel">
        {waitingRoom()}
      </div>
    );
  }

  return view();
}

export default VestibulePanel;