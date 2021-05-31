import React from 'react';
import './JoinRequests.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { handleJoinRequest } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import { setVisible, updateJoinRequests } from '../../../reducers/JoinRequestsSlice';
import store from '../../../store';

function JoinRequests() {
  const dispatch = useDispatch();
  const pendingJoinRequests = useSelector(state => state.joinRequests.pending);

  const isVisible = useSelector(state => state.joinRequests.isVisible);


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


  const handlePopupClose = () => {
    console.log(pendingJoinRequests)
    dispatch(setVisible(false));
  };

  
  function dialogContent() {
    if (pendingJoinRequests.length > 0) {
      return (
        <DialogContent>
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
        </DialogContent>
        
      );
    } else {
      return (
        <p className="request-placeholder">None</p>
      );
    }
  }


  return (
    <div className="requests-container">
      <Dialog
        open={isVisible}
        onClose={handlePopupClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Room Join Requests"}</DialogTitle>

        {dialogContent()}

        <DialogActions>
          <Button onClick={handlePopupClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default JoinRequests;