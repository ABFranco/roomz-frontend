import React, { useState, useEffect, useReducer } from 'react';
import { Link, useHistory, Switch, Route } from 'react-router-dom';
import './Room.css';

import Vestibule from '../Vestibule';
import RoomCanvas from './RoomCanvas';
import RoomBottomPanel from './RoomBottomPanel';
import RoomForm from '../RoomForm';

import { joinRoom, awaitRoomClosure } from '../../api/RoomzApiServiceClient.js';
import * as rssClient from '../../api/RoomzSignalingServerClient.js';
import { useDispatch, useSelector } from 'react-redux';

import { setJoinedRoom, setRoomUserName, clearRoomData } from '../../reducers/RoomSlice';
import { setChatHistory, clearChatHistory } from '../../reducers/ChatroomSlice';
import { setVestibuleJoin, clearVestibuleData } from '../../reducers/VestibuleSlice';
import { setErrorMessage } from '../../reducers/NotificationSlice';

import store from '../../store';


function Room() {
  const dispatch = useDispatch();
  const userInRoom = useSelector(state => (state.room.userInRoom !== false));
  const userInVestibule = useSelector(state => (state.vestibule.roomId !== null));
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [roomMediaStreams, dispatchMediaStreams] = useReducer(editMediaStream, []);
  const history = useHistory();

  // These are public domain STUN servers offered for free from Google.
  // Ty Google :)
  let ICE_SERVERS = [
    {urls:"stun:stun.l.google.com:19302"}
  ];
  // TODO: Move peerId to redux room store.
  let myPeerId = "";
  let roomyPcs = {};

  // initial checks upon loading the page 
  useEffect(() => {

    // upon refresh, user should always be in the vestibule
    if (userInRoom) {
      // update `userInVestibule` to true
      dispatch(setVestibuleJoin({roomId: store.getState().room.roomId}));
    }

    // upon refresh in vestibule and still joining a strict room, re-join if not yet accepted
    if (userInVestibule && store.getState().room.token === null) {
      roomJoinSubmit(store.getState().vestibule.roomId, store.getState().vestibule.roomPassword, store.getState().vestibule.userName);
    }

    rssClient.askToConnect()
  },[]);


  // upon entering the room as a non-host, join closure stream
  useEffect(() => {
    if (userInRoom && !store.getState().room.userIsHost && store.getState().room.token !== null) {
      joinRoomClosureStream();
    }
  },[userInRoom]);

  /**
   * @function toggleAudio - toggles mute on user's audio.
   */
  function toggleAudio() {
    let toggleAudioData = {
      'action': 'ToggleAudioStream',
    }
    dispatchMediaStreams(toggleAudioData)
  }

  /**
   * @function toggleVideo - toggles mute on user's video.
   */
  function toggleVideo() {
    let toggleVideoData = {
      'action': 'ToggleVideoStream',
    }
    dispatchMediaStreams(toggleVideoData)
  }

  /**
   * @function toggleMediaTracks - enables or disables audio or video tracks on a media stream.
   * @param {HTMLMediaElement} stream - A media stream.
   * @param {bool} isAudio - If the media stream is of audio type.
   */
  function toggleMediaTracks(stream, isAudio) {
    if (stream === null) {
      console.log('Invalid video stream, cannot toggle media.')
      return
    }
    let localMediaTracks = stream.getVideoTracks();
    let mediaType = 'video'
    if (isAudio) {
      mediaType = 'audio'
      localMediaTracks = stream.getAudioTracks();
    }
    if (localMediaTracks.length > 0) {
      // Disable or re-enable tracks on local stream.
      console.log('Toggling %o tracks from local stream', mediaType)
      for (var i = 0; i < localMediaTracks.length; i++) {
        console.log('Setting %o track enabled to=%o', mediaType, !localMediaTracks[i].enabled)
        localMediaTracks[i].enabled = !localMediaTracks[i].enabled
      }
    } else {
      console.log('No registered %i tracks on stream!', mediaType)
    }
  }

  /**
   * @function toggleAudio - Add Video Stream appends a peer's video stream data to the array of
   * video streams passed via props to the Grid component.
   * @param {HTMLMediaElement[]} prevRoomMediaStreams - An array of room media streams.
   * @param {Object} actionObject - A payload object used to determine which actions are performed to media streams.
   */
  function editMediaStream(prevRoomMediaStreams, actionObject) {
    console.log('editMediaStream, data=%o', actionObject)
    let newRoomMediaStreams = null;
    switch(actionObject.action) {
      case 'AddStream':
        console.log('Adding new media stream to grid')
        newRoomMediaStreams = [...prevRoomMediaStreams, actionObject];
        return newRoomMediaStreams;

      case 'RemoveStream':
        console.log('Removing media stream from grid')
        newRoomMediaStreams = [...prevRoomMediaStreams];
        for (var i = 0; i < newRoomMediaStreams.length; i++) {
          if (newRoomMediaStreams[i].peerId === actionObject.removePeerId) {
            console.log('Removed media stream for peerId=%o', actionObject.removePeerId)
            newRoomMediaStreams.splice(i, 1);
            break
          }
        }
        return newRoomMediaStreams;

      case 'ToggleAudioStream':
        console.log('Toggling mute auto on local stream');
        newRoomMediaStreams = [...prevRoomMediaStreams];
        if (newRoomMediaStreams.length > 0) {
          // Toggle mute on local video div.
          newRoomMediaStreams[0].muted = !newRoomMediaStreams[0].muted;
          // Also toggle audio tracks on outgoing local stream.
          toggleMediaTracks(newRoomMediaStreams[0].stream, true)
        }
        return newRoomMediaStreams;

      case 'ToggleVideoStream':
        console.log('Toggling mute video on local stream');
        newRoomMediaStreams = [...prevRoomMediaStreams];
        if (newRoomMediaStreams.length > 0) {
          // Toggle video tracks on local stream.
          toggleMediaTracks(newRoomMediaStreams[0].stream, false)
        }
        console.log('newRoomMediaStreams=%o', newRoomMediaStreams)
        return newRoomMediaStreams;

      default:
        console.log('Incorrect action for editMediaStream');
    }
  }

  /**
   * @function newPeerConnection - Creates a new Peer Connection.
   * @returns {PeerConnection} - A peer connection.
   */
  function newPeerConnection() {
    return new RTCPeerConnection(
      {"iceServers": ICE_SERVERS},
      // NOTE: This is needed for chrome/firefox/edge support.
      {"optional": [{"DtlsSrtpKeyAgreement": true}]}
    )
  }

  /**
   * @function joinMediaRoom - Emits the 'JoinMediaRoom' event to the RSS and registers
   * event handlers for possible response events from the RSS.
   */
  function joinMediaRoom() {
    let roomId = store.getState().room.roomId;
    let userId = store.getState().user.userId;
    myPeerId = roomId + "-" + userId;
    let data = {
      'user_id': userId,
      'room_id': roomId,
    }
    rssClient.joinMediaRoom(data, () => {
      // Once in the room, we must await any new joining RoomUser. Once this
      // happens, we must start the webrtc offer/answer process and relay of
      // ICE candidates so data can flow from one to the other P2P.
      rssClient.awaitAddPeer((data) => {
        console.log('Received request to AddPeer=%o', data)
        let peerId = data["peer_id"]
        // An 'AddPeer' request has a boolean 'is_offerer' field, this
        // indicates whether a person is the initial offerer to start the
        // offer/answer process. Any new joining member is the initiator.
        let isOfferer = data["is_offerer"]
        if (peerId in roomyPcs) {
          console.log('Already connected to peer=%o', peerId)
          return
        }

        // Create a fresh peer connection we will use to create offers/answers
        // relay ICE candidates on, and respond to new media events. Store
        // these away to grab the "socket" if you will to a peer's peer
        // connection.
        let pc = newPeerConnection()
        roomyPcs[peerId] = pc;

        // ICE Candidate events represent network connection candidates used to
        // form a connection between 2 peers.
        pc.onicecandidate = function(event) {
          console.log('Received possible ICE candidate for peerId=%o', peerId)
          console.log(event)
          if (event.candidate) {
            let iceCandidateData = {
              'from_peer_id': myPeerId,
              'to_peer_id': peerId,
              'ice_candidate': {
                // NOTE: I don't really know what this is yet, but is needed.
                'sdpMLineIndex': event.candidate.sdpMLineIndex,
                'candidate': event.candidate.candidate,
              }
            }
            rssClient.relayICECandidate(iceCandidateData, () => {
              console.log('Sent ICE Candidate to peerId=%o', peerId)
            })
          }
        }

        pc.onaddtrack = function (event) {
          console.log('New onaddtrack for peerId=%o', peerId)
          console.log(event)
        }

        // Await incoming media stream events on the peer connection.
        pc.onaddstream = function(event) {
          console.log('Incoming stream for peerId=%o', peerId)
          console.log(event)
          // TODO: muta audio/video.
          let addVideoData = {
            'action': 'AddStream',
            'stream': event.stream,
            'peerId': peerId,
            'muted': false,
          }
          dispatchMediaStreams(addVideoData);
        }
        
        // To begin sending media data to the new peer, we must add the stream
        // on the peer connection.
        if (roomMediaStreams.length > 0) {
          // NOTE: It is currently guaranteed that the first mediaStream is the
          // local media stream.
          console.log('Attaching local media stream onto peerId=%o\'s peer connection')
          pc.addStream(roomMediaStreams[0].stream);
        }

        // If offerer, create an offer to the existing RoomUser, and then
        // set the local description on the peer connection to communicate
        // what media they recognize.
        if (isOfferer) {
          console.log('Creating offer to peerId=%o', peerId);
          pc.createOffer(
            function(localDescription) {
              console.log('Local sdp: ', localDescription)
              pc.setLocalDescription(localDescription,
                function() {
                  let sdpData = {
                    'from_peer_id': myPeerId,
                    'to_peer_id': peerId,
                    'sdp': localDescription,
                  }
                  rssClient.relaySDP(sdpData, () => {})
                },
                function() { alert("setLocalDescription failed!")}
              )
            },
            function(e) {
              console.log('Error sending offer=%o', e)
            }
          )
        }
      })

      // If not the offerer, the RFE client must respond to offers from any
      // incoming new RoomUsers. They do this by creating answers on the
      // new RoomUser's peer connection, and then setting the remote/local
      // descriptions to complete the media acceptance agreement.
      rssClient.awaitIncomingSDP((data) => {
        console.log('Received incoming sdp=%o', data)
        let peerId = data["peer_id"]
        let pc = roomyPcs[peerId];
        let remoteSDP = data["sdp"];
        let desc = new RTCSessionDescription(remoteSDP);
        let stuff = pc.setRemoteDescription(desc,
          function() {
            console.log('Set remote description for peerId=%o', peerId)
            if (remoteSDP.type === "offer") {
              console.log('Received an offer from peerId=%', peerId)
              pc.createAnswer(
                function(localDescription) {
                  console.log('Answer description for peerId=%o is =%o', peerId, localDescription)
                  pc.setLocalDescription(localDescription,
                    function() {
                      let sdpData = {
                        'from_peer_id': myPeerId,
                        'to_peer_id': peerId,
                        'sdp': localDescription,
                      }
                      rssClient.relaySDP(sdpData, () => {})
                    },
                    function(e) {
                      console.log('Error setting local description for peerId=%o, error=%o', peerId, e)
                    }
                  )
                },
                function(e) {
                  console.log('error creating answer=%o', e)
                }
              )
            }
          },
          function(e) {
            console.log('setRemoteDescription error=%o', e)
          }
        )
        console.log('description object: ', desc);
      })

      // The RFE Client must also respond to ICE or simply network connection
      // canidate events. The ICE candidate must be added to the peer's peer
      // connection.
      rssClient.awaitIncomingICECandidate((data) => {
        let peerId = data["peer_id"]
        let pc = roomyPcs[peerId]
        let iceCandidate = data["ice_candidate"]
        console.log('Set ICE candidate for peerId=%o', peerId)
        console.log(iceCandidate)
        pc.addIceCandidate(new RTCIceCandidate(iceCandidate))
      })

      // The RFE Client must handle peers leaving the room, and delete the
      // resources accordingly.
      rssClient.awaitRemovePeer((data) => {
        let peerId = data["peer_id"]
        console.log('Removing peerId=%o from the media room', peerId)
        if (peerId in roomyPcs) {
          let removeStreamData = {
            'action': 'RemoveStream',
            'removePeerId': peerId,
          }
          dispatchMediaStreams(removeStreamData)
          roomyPcs[peerId].close();
        }
        delete roomyPcs[peerId];
      })
    }) // End: joinMediaRoom.
  }

  function leaveMediaRoom() {
    let roomId = store.getState().room.roomId;
    let userId = store.getState().user.userId;
    myPeerId = roomId + "-" + userId;
    let data = {
      'peer_id': myPeerId,
    }
    rssClient.leaveMediaRoom(data, () => {
      console.log("peerId=%o has requested to leave the room", myPeerId)
    })
  }


  /**
   * @function roomLeaveInvalid - room participant is in an invalid room url and exits
   */
  function roomLeaveInvalid() {
    history.push('/');
  }


  /**
   * @function joinRoomClosureStream - If non-host, join stream to detect when host closes the room
   */
  async function joinRoomClosureStream() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
      token: store.getState().room.token,
    };
    console.log(':Room.joinRoomClosureStream: Attempting to join closure stream with data=%o', data);

    try {
      const closureStream = await awaitRoomClosure(data);
      
      closureStream.on('data', (data) => {
        history.push('/');
      });

      closureStream.on('end', () => {
        console.log(':Room.joinRoomClosureStream: Stream ended.');
      });

    } catch (err) {
      console.log(':Room.joinRoomClosureStream: Failed to receive closure stream. err=%o', err);
    }
  }


  /**
   * @function roomJoinSubmit - submit form to join a room
   */
   async function roomJoinSubmit(roomId, roomPassword, userName) {
    try {
      if (roomId === '') {
        throw new Error('Enter a Room ID');
      } else if (roomPassword === '') {
        throw new Error('Enter a Room Password');
      } else if (userName === '') {
        throw new Error('Enter a personal Name');
      }
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      return;
    }

    let data = {
      roomId: roomId,
      roomPassword: roomPassword,
      userName: userName,
      userId: store.getState().user.userId,
      isGuest: store.getState().user.userId == null,
    };

    // reset room data, add userName to state
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    dispatch(clearVestibuleData());
    dispatch(setRoomUserName(userName));

    try {
      const joinRoomResponseStream = await joinRoom(data);

      // update vestibule state
      let vestibulePayload = {
        roomId: roomId,
        roomPassword: roomPassword,
        userName: userName,
      };
      dispatch(setVestibuleJoin(vestibulePayload));
      history.push(`/room/${roomId}`);

      // stream listeners
      joinRoomResponseStream.on('data', (response) => {
        receiveJoinRoomResponse(response);
      });

      joinRoomResponseStream.on('error', (err) => {
        console.log(':RoomForm.roomJoinSubmit: Stream error: %o', err);
        let errorMessage = 'An unexpected error has occurred when joining a Room.';
        if (err && 'message' in err) {
          errorMessage = err['message'];
        }
        dispatch(setErrorMessage(errorMessage));
      });

      joinRoomResponseStream.on('end', () => {
        console.log(':RoomForm.roomJoinSubmit: Stream ended.');
      });

    } catch (err) {
      console.log(':RoomJoin.roomJoinSubmit: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when joining a Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }

  /**
   * @function receiveJoinRoomResponse - response after requesting to join a Room
   * @param {Object} response 
   */
   function receiveJoinRoomResponse(response) {
    let roomId = response.getRoomId();
    let status = response.getStatus();

    if (status === 'accept') {
      let vestibulePayload = {
        roomId: roomId,
        roomPassword: null,
        userName: null,
      };
      dispatch(setVestibuleJoin(vestibulePayload));

      // cleanup chatHistory json
      let chatHistory = response.getChatHistoryList();

      let chatHistoryData = [];
      for (let i = 0; i < chatHistory.length; i++) {
        chatHistoryData.push({
          userId: chatHistory[i].getUserId(),
          name: chatHistory[i].getUserName(),
          message: chatHistory[i].getMessage(),
          timestamp: chatHistory[i].getTimestamp(),
        });
      }
      dispatch(setChatHistory(chatHistoryData));

      // update state to allow entering room
      let payload = {
        roomId: roomId,
        token: response.getToken(),
        isStrict: false, // TODO: does this matter?
      }
      dispatch(setJoinedRoom(payload));

    } else if (status === 'wait') {
      console.log(':Room.receiveJoinRoomResponse: Detected wait room');
    } else if (status === 'reject') {
      console.warn(':Room.receiveJoinRoomResponse: Failed to join room.');
      dispatch(setErrorMessage('Failed to join room.'));
    } else {
      console.warn(':Room.receiveJoinRoomResponse: Unknown error.');
      dispatch(setErrorMessage('Unknown error.'));
    }
  }


  function invalidRoom() {
    return (
      <div className="room-container">
        <div className="invalid-room">
          <h2>Invalid Room Id</h2>
        </div>
        <Link to="/">
          <button className="room-form-btn button-secondary" onClick={roomLeaveInvalid}>Return Home</button>
        </Link>
      </div>
    );
  }

  function view() {
    if (userInVestibule) {
      // user is in the Vestibule
      return (
        <Vestibule
          dispatchMediaStreams={dispatchMediaStreams}/>
      );
      
    } else if (userInRoom) {
      // user is in the Room view
      return (
        <div className="room-container">
          <RoomCanvas
            roomMediaStreams={roomMediaStreams}/>
          <RoomBottomPanel />
        </div>
      );
    } else {
      // user is in a Room form
      return (
        <Switch>
          <Route path="/room/create">
              <RoomForm />
            </Route>
            <Route path="/room/join">
              <RoomForm roomJoinSubmit={roomJoinSubmit}/>
            </Route>
            <Route path="/room/:roomId">
              {invalidRoom}
            </Route>
        </Switch>
      );
    }
  }

  return view();
}

export default Room;