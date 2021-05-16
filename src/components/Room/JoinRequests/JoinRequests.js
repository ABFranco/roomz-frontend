import React, { useState, useEffect } from 'react';
import thumbsUp from '../../../assets/thumbs_up.png';
import thumbsDown from '../../../assets/thumbs_down.png';

import { handleJoinRequest } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch } from 'react-redux';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import store from '../../../store';

function JoinRequests() {
  const dispatch = useDispatch();

  const [joinRequests, setJoinRequests] = useState([]);  // list of names of users requesting to join room

  /**
   * @function respondToJoinRequest - handler for host accepting/rejecting join request as host
   * @param {Object} joinEntry - object with "userId" and "name"
   * @param {boolean} accept - true or false
   */
  async function respondToJoinRequest(joinEntry, accept) {
    let data = {
      roomId: store.getState().room.roomId,
      userIdToHandle: joinEntry.userId,
      decision: accept ? 'accept' : 'reject',
    };

    try {
      const response = await handleJoinRequest(data);
      if ('error' in response) {
        throw response['error'];
      }

      // updateJoinRequests(); // TODO refresh join requests from the JoinRequests component

    } catch (err) {
      console.log(':respondToJoinRequest: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when handling a join request.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }


  return (
    <div id="requestsView" className="requests-container hidden">
      <div className="room-requests-view">
        <p className="requests-title">Join Room Requests:</p>

        {joinRequests.map((joinEntry, index) => (
          <div key={("request-%s", index)} className="pending-request-object">
            <div className="pending-select-options-container">
              <img id={("press-yes-%s", joinEntry.userId)} className="pending-img" src={thumbsUp} onClick={() => respondToJoinRequest(joinEntry, true)} alt="yes"/>
              <br></br>
              <img id={("press-no-%s", joinEntry.userId)} className="pending-img" src={thumbsDown} onClick={() => respondToJoinRequest(joinEntry, false)} alt="no"/>
            </div>
            <p className="pending-request-object-name">{joinEntry.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JoinRequests;