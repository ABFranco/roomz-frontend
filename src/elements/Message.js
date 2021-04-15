import React from 'react';
import './Message.css';

function Message(props) {
    return (
        <div className="message-container">
            <b><p className="message-timestamp">
            {'[' + props.timestamp + '] '}
            </p></b>
            <b><p className="message-name">
                {props.username + ":"}
            </p></b>
            <p className="message-text">
                {props.message}
            </p>
        </div>
    );
}

export default Message;