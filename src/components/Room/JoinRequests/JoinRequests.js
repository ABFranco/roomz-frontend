import React from 'react';

import thumbsUp from '../../../assets/thumbs_up.png';
import thumbsDown from '../../../assets/thumbs_down.png';
import './JoinRequests.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import { handleJoinRequest } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import { updateJoinRequests } from '../../../reducers/JoinRequestsSlice';
import store from '../../../store';

function JoinRequests() {
  const dispatch = useDispatch();
  const pendingJoinRequests = useSelector(state => state.joinRequests.pending);


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

      dispatch(updateJoinRequests(data));

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

        <List className="list-join-requests">
          {pendingJoinRequests.map((joinEntry, index) => (
            <ListItem key={("request-%s", index)}>
              <ListItemText className="request-text">{joinEntry.name}</ListItemText>
              <IconButton size="small" onClick={() => respondToJoinRequest(joinEntry, true)}>
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => respondToJoinRequest(joinEntry, false)}>
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  )
}

export default JoinRequests;