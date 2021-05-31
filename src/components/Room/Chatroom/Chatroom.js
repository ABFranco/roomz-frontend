import React, { useEffect, useRef } from 'react';
import './Chatroom.css';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import Message from '../../../elements/Message.js';
import { enterChatRoom } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, appendChatMessage } from '../../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';


const useStyles = makeStyles(() => ({
  drawerPaper: {
    height: 'calc(100% - 110px)',
    borderLeft: '1px solid var(--gray)',
  }
}));

function Chatroom() {
  const dispatch = useDispatch();
  const chatHistory = useSelector(state => (state.chatroom.chatHistory));

  const message = useRef();

  const classes = useStyles();
  const open = useSelector(state => (state.chatroom.isVisible));

  useEffect(() => {
    // join chat room upon entering the view, this should only occur once
    joinChatRoomStream();
  },[]);


  /**
   * @function joinChatRoomStream - Join stream to receive incoming chatroom messages
   */
  async function joinChatRoomStream() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
      token: store.getState().room.token,
    };
    console.log(':Chatroom.joinChatRoomStream: Attempting to join chatroom with data=%o', data);

    try {
      const chatStream = await enterChatRoom(data);

      chatStream.on('data', (data) => {
        receiveChatMessage(data);
      });

      chatStream.on('end', () => {
        console.log(':Chatroom.joinChatRoomStream: Stream ended.');
      });

    } catch (err) {
      console.warn(':Chatroom.joinChatRoomStream: Failed to join chatroom stream. err=%o', err);
      dispatch(setErrorMessage(String(err)));
    }
  }


  /**
   * @function handleSendChatMessage - send chatroom message
   */
  async function handleSendChatMessage() {
    if (message.current.value.length === 0) {
      return;
    }

    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
      username: store.getState().room.roomUserName,
      message: message.current.value,
      timestamp: String(Date.now()),
    };

    console.log(':Chatroom.handleSendChatMessage: Sending chat message with data=%o', data);
    try {
      const response = await dispatch(sendChatMessage(data));
      if ('error' in response) {
        throw response['error'];
      }
      console.log(':Chatroom.handleSendChatMessage: response=%o', response);

    } catch (err) {
      console.log(':Chatroom.handleSendChatMessage: Failed to send chat message. err=%o', err);
      let errorMessage = 'An unexpected error has occurred when sending a chat message.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
    
    // clear value after submitting
    message.current.value = '';
  }


  /**
   * @function receiveChatMessage - extract message data and update state
   * @param {Object} data 
   */
  function receiveChatMessage(data) {
    let newMessage= {
      userId: data.getUserId(),
      name: data.getUserName(),
      message: data.getMessage(),
      timestamp: (new Date(parseInt(data.getTimestamp()))).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    };

    dispatch(appendChatMessage(newMessage));
  }

  // handle keyboard input
  function keyboardSendChatMessage(event) {
    if (event.key === 'Enter') {
      handleSendChatMessage();
    }
  }

  return (
    <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
      <div className="chatroom-container">
        <div className="chatroom-header">
          <h2>chat</h2>
        </div>

        <div className="chatroom-messages">
          {chatHistory.map((m, index) => (
            <Message 
            key={("message-%s", index)}
            username={m.name}
            message={m.message}
            timestamp={m.timestamp} />
          ))}
        </div>

        <div className="chatroom-footer">
          <input type="text" onKeyPress={keyboardSendChatMessage} className="form-input form-message-input" placeholder="Enter a message..." ref={message} autoFocus />
          <button onClick={handleSendChatMessage} className="button-primary chat-submit">
            {'>'}
          </button>
        </div>         
      </div>
    </Drawer>
    
  );
}

export default Chatroom;