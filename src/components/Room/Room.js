import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Chatroom from './Chatroom';

import thumbsUp from '../../assets/thumbs_up.png';
import thumbsDown from '../../assets/thumbs_down.png';

import './Room.css';

import { useDispatch, useSelector } from 'react-redux';
import { roomDelete, roomLeave } from '../../reducers/RoomSlice';
import { clearChatHistory } from '../../reducers/ChatroomSlice';
import store from '../../store';

function Room() {
  const dispatch = useDispatch();

  const userInRoom = useSelector(state => (state.room.userInRoom !== null));

  const history = useHistory();

  const [roomId, setRoomId] = useState(null);            // ID of room the user is currently in
  const [joinRequests, setJoinRequests] = useState([]);  // list of names of users requesting to join room
  const [errorMessage, setErrorMessage] = useState("");  // error message


  // update local hook
  // useEffect(() => {
  //     setRoomId(props.roomInfo.roomId);
  // }, [props.roomInfo])


  // function resetRoomInfo() {
  //     props.setRoomInfo((prevRoomInfo) => ({
  //         ...prevRoomInfo,
  //         roomId        : null,
  //         userIsHost    : false,
  //         isStrict      : null,
  //         userIsJoining : false,
  //         userInRoom    : false
  //     }))
  // }

  /**
   * @function roomLeaveAsNonHost - non-host leaves the room
   */
  async function roomLeaveAsNonHost() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    }

    console.log(':Room.roomLeave: Leaving room with data=%o', data);

    try {
      const response = await dispatch(roomLeave(data));
      if ('error' in response) {
        throw response['error'];
      }
      
      // room successfully left
      console.log(":RoomForm.roomLeaveAsNonHost: response=%o", response);

      // clear chatroom's chat history
      dispatch(clearChatHistory());

      // room left, go home
      history.push("/");

    } catch (err) {
      console.log(':RoomForm.roomLeaveAsNonHost: err=%o', err);
      let errorMessage = "An unexpected error has occurred when leaving the Room.";
      if (err && 'message' in err) {
          errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }

  /**
   * @function roomCancel - room participant cancels request to join a room
   */
  function roomCancel() {
    return
  }
  //     // room participant is in an invalid room url and exits

  //     // NOTE: going home via React Router Link
  //     resetRoomInfo();
  // }


  /**
   * @function roomDeleteAsHost - Host closes the Room
   */
  async function roomDeleteAsHost() {
    let data = {
        'roomId' : store.getState().room.roomId,
        // 'host_user_id' : props.userInfo.userId
    }

    try {
      const response = await dispatch(roomDelete(data));
      if ('error' in response) {
        throw response['error'];
      }
      
      // room successfully deleted
      console.log(":RoomForm.roomDelete: response=%o", response);

      // clear chatroom's chat history
      dispatch(clearChatHistory());

      // room closed, go home
      history.push("/");

    } catch (err) {
      console.log(':RoomForm.roomDelete: err=%o', err);
      let errorMessage = "An unexpected error has occurred when closing the Room.";
      if (err && 'message' in err) {
          errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  // set join request data into state
  function handleGetJoinRequestsResp(response) {}
  //     let joinRequests = [];
  //     let incomingJoinRequests = response.getJoinRequestsList();
  //     console.log(':Room.handleGetJoinRequestsResp: incomingJoinRequests=%o', incomingJoinRequests);

  //     for (var i = 0; i < incomingJoinRequests.length; i++) {
  //         joinRequests.push({
  //             'userId' : incomingJoinRequests[i].getUserId(),
  //             'name' : incomingJoinRequests[i].getUserName()
  //         })
  //     }

  //     // set state
  //     setJoinRequests(joinRequests);
  // }

  // retrieve the current join requests that are pending
  function updateJoinRequests() {}
  //     // retrieve current join requests
  //     let data = {
  //         'roomId' : roomId,
  //         'userId' : props.userInfo.userId
  //     }
      
  //     apiClient.getJoinRequests(data)
  //         .then(response => {
  //             console.log(':Room.updateJoinRequests: response=%o', response);
  //             handleGetJoinRequestsResp(response);
  //         })
  //         .catch(error => {
  //             console.log(':Room.updateJoinRequests: error=%o', error);

  //             let errorMessage = "An unexpected error has occurred when retrieving join requests.";
  //             if (error && "message" in error) {
  //                 errorMessage = error["message"];
  //             }
  //             console.warn(errorMessage);
  //         });
  // }

  // open/close requests window
  function requestsViewClick() {}
      

  //     if (document.getElementById("requestsView").classList.contains("hidden")) {
  //         document.getElementById("requestsView").classList.remove("hidden");

  //         // retreive current join requests
  //         updateJoinRequests();
  //     } else {
  //         document.getElementById("requestsView").classList.add("hidden");
  //     }
  // }

  // handler for host accepting/rejecting join request
  function handleRequest(userEntry, accept) {}
      

  //     let data = {
  //         'roomId'         : roomId,
  //         'userIdToHandle' : userEntry.userId,
  //         'decision'       : accept ? 'accept' : 'reject'
  //     }

  //     apiClient.handleJoinRequest(data)
  //         .then(response => {
  //             console.log(':Room.handleRequest: Sucessfully handled join request. response=%o', response);

  //             // refresh join requests
  //             updateJoinRequests();
  //         })
  //         .catch(error => {
  //             console.log(':Room.handleRequest: error=%o', error);

  //             let errorMessage = "An unexpected error has occurred when handling a join request.";
  //             if (error && "message" in error) {
  //                 errorMessage = error["message"];
  //             }
  //             console.warn(errorMessage);
  //         });
  // }

  function requestsView() {
      return (
          <div className="room-requests-view">
              {/* <p className="requests-title">Join Room Requests:</p>
              {joinRequests.map((r, index) => (
                  <div key={("request-%s", index)} className="pending-request-object">
                      <div className="pending-select-options-container">
                          <img id={("press-yes-%s", r.userId)} className="pending-img" src={thumbsUp} onClick={() => handleRequest(r, true)} alt="yes"/>
                          <br></br>
                          <img id={("press-no-%s", r.userId)} className="pending-img" src={thumbsDown} onClick={() => handleRequest(r, false)} alt="no"/>
                      </div>
                      <p className="pending-request-object-name">{r.name}</p>
                  </div>
              ))} */}
          </div>
      )
  }

  function roomShare() {
      // view "share" link
      // TODO
      return
  }

  function roomViewActions() {
    if (store.getState().room.userIsHost) {
      if (store.getState().room.isStrict) {
        return (
          <div className="room-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
            <button id="joinRequestsBtn" className="room-form-btn button-primary" onClick={requestsViewClick}>Join Requests</button>
          </div>
        )
      } else {
        return (
          <div className="room-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
          </div>
        )
      }
        
    } else {
      return (
        <div className="room-actions">
          <button className="room-form-btn button-secondary" onClick={roomLeaveAsNonHost}>Leave Room</button>
          <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
        </div>
      )
        
    }
  }

  function roomView() {
    return (
      <div className="room-view">
        <div className="room-header">
          <h1>Roomz</h1>
        </div>

        <p className="room-id-label"><b>Room ID: </b>{store.getState().room.roomId}</p>
        <p><b>Your name: </b>{store.getState().room.roomUserName}</p>

        <div className="room-actions">
          {roomViewActions()}
        </div>

        <Chatroom />

        <p id="roomErrorMsg" className="">{errorMessage}</p>
      </div>
    ) 
  }

  function view() {
    if (userInRoom) {
      return (
        <div className="super-room-container">
          <div className="room-container">
            {roomView()}
          </div>
          <div id="requestsView" className="requests-container hidden">
            {requestsView()}
          </div>
        </div>
      )
    } else {
      return (
        <div className="room-container">
          <div className="invalid-room">
            <h2>Invalid Room Id</h2>
          </div>
          <Link to="/">
            <button className="room-form-btn button-secondary" onClick={roomCancel}>Return Home</button>
          </Link>
        </div>
      )
    }
  }

  return view();
}

export default Room;