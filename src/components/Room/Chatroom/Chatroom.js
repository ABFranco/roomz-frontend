import React, { useEffect, useRef, useReducer } from 'react';
import './Chatroom.css';
import Message from '../../../elements/Message.js';
import * as apiClient from '../../../api/RoomzApiServiceClient.js'

function Chatroom(props) {
    const [chatHistory, dispatchChatHistory] = useReducer(receiveChatMessage, props.roomInfo.chatHistory);
    const message = useRef();
    
    // join chat room upon entering the view
    useEffect(() => {
        // this should only occur once
        joinChatRoomStream();
        joinRoomClosureStream();
    },[]);

    useEffect(() => {
        // update roomInfo object for caching
        props.setRoomInfo((prevRoomInfo) => ({
            ...prevRoomInfo,
            chatHistory: [...chatHistory]
        })); 
    },[chatHistory]);


    function joinRoomClosureStream() {
        // request stream that awaits room closure by the host

        let data = {
            'roomId'    : props.roomInfo.roomId,
            'userId'    : props.userInfo.userId,
            'token'     : props.roomInfo.token
        };
        console.log(':Chatroom.joinRoomClosureStream: Attempting to join closure stream with data=%o', data);

        apiClient.awaitRoomClosure(data)
            .then(closureStream => {
                console.log(':Chatroom.joinRoomClosureStream: Receieved closureStream=%o', closureStream);
                closureStream.on('data', (data) => {
                    console.log(':Chatroom.joinRoomClosureStream: Host closed room!');

                    // exit room
                    props.setRoomInfo((prevRoomInfo) => ({
                        ...prevRoomInfo,
                        roomId        : null,
                        userIsHost    : false,
                        isStrict      : null,
                        userIsJoining : false,
                        userInRoom    : false
                    }));
                    
                });

                closureStream.on('end', () => {
                    console.log(':Chatroom.joinRoomClosureStream: Stream ended.');
                });

            })
            .catch(error => {
                console.log(':Chatroom.joinRoomClosureStream: Failed to receive closure stream. error=%o', error);
            });
    }


    function joinChatRoomStream() {
        // joins the chat room. Access a stream to receive incoming chatroom messages

        let data = {
            'roomId'    : props.roomInfo.roomId,
            'userId'    : props.userInfo.userId,
            'token'     : props.roomInfo.token
        };
        console.log(':Chatroom.joinChatRoomStream: Attempting to join chatroom with data=%o', data);

        apiClient.enterChatRoom(data)
            .then(chatStream => {
                console.log(':Chatroom.joinChatRoomStream: Receieved chatStream=%o', chatStream);
                chatStream.on('data', (data) => {
                    // console.log(':Chatroom.joinChatRoomStream: Received data: %o', data);
                    dispatchChatHistory(data);

                    
                });

                chatStream.on('end', () => {
                    console.log(':Chatroom.joinChatRoomStream: Stream ended.');
                });

            })
            .catch(error => {
                console.log(':Chatroom.joinChatRoomStream: Failed to join chatroom. error=%o', error);
            });
    }

    
    function appSendChatMessage() {
        // send chatroom message

        if (message.current.value.length === 0) {
            return
        }

        // publish chat message to room
        let name = props.userInfo.name;
        let userId = props.userInfo.userId;

        let data = {
            'roomId'    : props.roomId,
            'userId'    : userId,
            'username'  : name,
            'message'   : message.current.value,
            'timestamp' : String(Date.now())
        };

        console.log(':Chatroom.appSendChatMessage: Sending chat message with data=%o', data);
        apiClient.chatMessage(data)
            .then(response => {
                // console.log(':Chatroom.appSendChatMessage: Message successfully sent. response=%o', response);
                
            })
            .catch(error => {
                console.log(':Chatroom.appSendChatMessage: error=%o', error);

                let errorMessage = "An unexpected error has occurred when sending a chat message.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }
                console.warn(errorMessage);
            });
        
        
        // clear value after submitting
        message.current.value = '';
    }


    // handle keyboard input
    function handleAppSendChatMessage(event) {
        if (event.key === "Enter") {
            appSendChatMessage();
        }
    }


    
    function receiveChatMessage(prevChatHistory, data) {
        // receive chatroom messages

        // console.log(':Chatroom.receiveChatMessage: prevChatHistory=%o', prevChatHistory);
        let newMessage= {
            'userID' : data.getUserId(),
            'name' : data.getUserName(),
            'message' : data.getMessage(),
            'timestamp' : (new Date(parseInt(data.getTimestamp()))).toLocaleTimeString([], {hour: '2-digit', minute: "2-digit"})
        };
        // console.log(':Chatroom.receiveChatMessage: newMessage=%o', newMessage);

        // add message to chat history
        let newChatroomHistory = [...prevChatHistory, newMessage]

        return newChatroomHistory
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
            <input type="text" onKeyPress={handleAppSendChatMessage} className="form-input form-message-input" placeholder="Enter a message..." ref={message} autoFocus />
            <button onClick={appSendChatMessage} className="button-primary chat-submit">
                {'>'}
            </button>
            </div>         
        </div>
        );
}

export default Chatroom;