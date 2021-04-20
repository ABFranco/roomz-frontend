import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../RoomForm.css';

import { useDispatch, useSelector } from 'react-redux';
import { roomCreate, setRoomUserName, clearRoomData } from '../../../reducers/RoomSlice';
import { clearChatHistory } from '../../../reducers/ChatroomSlice';
import store from '../../../store';

function RoomCreate() {
  const dispatch = useDispatch();
  const signedIn = useSelector(state => (state.user.userId !== null));

  const history = useHistory();

  // const [grantedRoomAccess, setGrantedRoomAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  let passwordInput = useRef();
  let passwordConfirmInput = useRef();
  const createRoomName = useRef();
  const isStrictInput = useRef();


  /**
   * @function roomCreateSubmit - submit form to create a Room
   */
  async function roomCreateSubmit() {
    // submits Create Room form
    if (passwordInput.current.value !== passwordConfirmInput.current.value) {
      setErrorMessage('Both passwords must match!');
    } else {
      let userId = store.getState().user.userId;
      let userName = createRoomName.current.value;
      let data = { 
        userId: userId,
        userName: userName,
        password: passwordInput.current.value,
        isStrict: !(isStrictInput.current.checked)
      }

      console.log(':RoomCreate.roomCreateSubmit: Attempting to create room with data=%o', data);

      try {
        const response = await dispatch(roomCreate(data));
        if ('error' in response) {
          throw response['error'];
        }

        // clear chatroom data, add userName to state
        dispatch(clearChatHistory());
        dispatch(setRoomUserName(data['userName']));

        // TODO: instead of joining room immedietly, go into vestibule
        history.push(`/room/${store.getState().room.roomId}`)
  
      } catch (err) {
        console.log(':RoomForm.roomCreateSubmit: err=%o', err);
        let errorMessage = 'An unexpected error has occurred when creating a Room.';
        if (err && 'message' in err) {
            errorMessage = err['message'];
        }
        setErrorMessage(errorMessage);
      }
    }
  }


  function keyboardCreateJoin(event) {
    // handle keyboard input
    if (event.key === 'Enter') {
        roomCreateSubmit();
    }
  }

  function roomForm() {
    return (
      <form className="room-form">
        <div className="room-form-input">
          <label htmlFor="password">Room Password</label>
          <input id="password" ref={passwordInput} type="password" autoFocus />
        </div>
        <div className="room-form-input">
          <label htmlFor="passwordConfirm">Confirm Room Password</label>
          <input id="passwordConfirm" ref={passwordConfirmInput} type="password" />
        </div>
        <div className="room-form-input">
          <label htmlFor="name">Your Name in the Room</label>
          <input id="name" ref={createRoomName} type="text" />
        </div>
        <div className="room-form-checkbox">
          <input id="passwordRequired" ref={isStrictInput} type="checkbox" />
          <label htmlFor="passwordRequired">Anyone with password can join</label>
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
        <button className="room-form-btn button-primary" onClick={roomCreateSubmit}>Create</button>
      </div>
    )
  }


  function view() {
    if (!signedIn) {
      return (
        <div className="room-container">
          <div className="not-signed-in">
            <h2>Not Signed In</h2>
          </div>
          <Link to="/">
            <button className="room-form-btn button-secondary">Return Home</button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="room-container" onKeyPress={keyboardCreateJoin}>
          <div className="room-header">
            <h1>Create a Room</h1>
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

export default RoomCreate;