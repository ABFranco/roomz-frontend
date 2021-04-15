import React, { useEffect, useRef, useReducer } from 'react';
import './Chatroom.css';
import Message from '../../../elements/Message.js';

import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, appendChatMessage } from '../../../reducers/ChatroomSlice';
import store from '../../../store';

import { enterChatRoom } from '../../../api/RoomzApiServiceClient.js';

function Chatroom() {
  const dispatch = useDispatch();
  const chatHistory = useSelector(state => (state.chatroom.chatHistory));

  const message = useRef();
  
  // join chat room upon entering the view
  useEffect(() => {
      // this should only occur once
      joinChatRoomStream();
      // joinRoomClosureStream();
  },[]);

  // useEffect(() => {
  //     // update roomInfo object for caching
  //     props.setRoomInfo((prevRoomInfo) => ({
  //         ...prevRoomInfo,
  //         chatHistory: [...chatHistory]
  //     })); 
  // },[chatHistory]);


  function joinRoomClosureStream() {}
  //     // request stream that awaits room closure by the host

  //     let data = {
  //         'roomId'    : props.roomInfo.roomId,
  //         'userId'    : props.userInfo.userId,
  //         'token'     : props.roomInfo.token
  //     };
  //     console.log(':Chatroom.joinRoomClosureStream: Attempting to join closure stream with data=%o', data);

  //     apiClient.awaitRoomClosure(data)
  //         .then(closureStream => {
  //             console.log(':Chatroom.joinRoomClosureStream: Receieved closureStream=%o', closureStream);
  //             closureStream.on('data', (data) => {
  //                 console.log(':Chatroom.joinRoomClosureStream: Host closed room!');

  //                 // exit room
  //                 props.setRoomInfo((prevRoomInfo) => ({
  //                     ...prevRoomInfo,
  //                     roomId        : null,
  //                     userIsHost    : false,
  //                     isStrict      : null,
  //                     userIsJoining : false,
  //                     userInRoom    : false
  //                 }));
                  
  //             });

  //             closureStream.on('end', () => {
  //                 console.log(':Chatroom.joinRoomClosureStream: Stream ended.');
  //             });

  //         })
  //         .catch(error => {
  //             console.log(':Chatroom.joinRoomClosureStream: Failed to receive closure stream. error=%o', error);
  //         });
  // }


  // joins the chat room. Access a stream to receive incoming chatroom messages
  async function joinChatRoomStream() {
    let data = {
      'roomId': store.getState().room.roomId,
      'userId': store.getState().user.userId,
      'token': store.getState().room.token
    };
    console.log(':Chatroom.joinChatRoomStream: Attempting to join chatroom with data=%o', data);

    try {
      const chatStream = await enterChatRoom(data);
      
      // chatroom successfully joined
      console.log(":Chatroom.joinChatRoomStream: chatStream=%o", chatStream);

      chatStream.on('data', (data) => {
        console.log(':Chatroom.joinChatRoomStream: Received data: %o', data);
        receiveChatMessage(data);
      });

      chatStream.on('end', () => {
        console.log(':Chatroom.joinChatRoomStream: Stream ended.');
      });

    } catch (err) {
      console.warn(':Chatroom.joinChatRoomStream: Failed to join chatroom. err=%o', err);
      // let errorMessage = "An unexpected error has occurred when joining Chatroom stream.";
      // if (err && 'message' in err) {
      //     errorMessage = err['message'];
      // }
      // setErrorMessage(errorMessage);
    }
  }


  /**
   * @function handleSendChatMessage - send chatroom message
   */
  async function handleSendChatMessage() {

    if (message.current.value.length === 0) {
      return
    }

    // send chat message to room
    let name = store.getState().room.roomUserName;
    let userId = store.getState().user.userId;

    let data = {
        'roomId': store.getState().room.roomId,
        'userId': userId,
        'username': name,
        'message': message.current.value,
        'timestamp': String(Date.now())
    };

    console.log(':Chatroom.sendChatMessage: Sending chat message with data=%o', data);
    try {
      const response = await dispatch(sendChatMessage(data));
      if ('error' in response) {
        throw response['error'];
      }

      console.log(':Chatroom.sendChatMessage: Message successfully sent. response=%o', response);

    } catch (err) {
      console.log(':Chatroom.joinChatRoomStream: Failed to send chat message. err=%o', err);
      let errorMessage = "An unexpected error has occurred when sending a chat message.";
      if (err && "message" in err) {
          errorMessage = err["message"];
      }
      console.warn(errorMessage);
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
          'userID' : data.getUserId(),
          'name' : data.getUserName(),
          'message' : data.getMessage(),
          'timestamp' : (new Date(parseInt(data.getTimestamp()))).toLocaleTimeString([], {hour: '2-digit', minute: "2-digit"})
      };

      console.log(":Chatroom.receiveChatMessage: newMessage=%o", newMessage);

      dispatch(appendChatMessage(newMessage));
  }

  // handle keyboard input
  function keyboardSendChatMessage(event) {
    if (event.key === "Enter") {
      handleSendChatMessage();
    }
}


  return (
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
    );
}

export default Chatroom;