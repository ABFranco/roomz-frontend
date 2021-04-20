import  { RoomzApiServiceClient } from './../proto/roomzapi_grpc_web_pb';
import {
    CreateAccountRequest, 
    SignInRequest, 
    CreateRoomRequest, 
    CloseRoomRequest,
    AwaitRoomClosureRequest,
    JoinRoomRequest,
    LeaveRoomRequest,
    EnterChatRoomRequest,
    ChatMessage,
    GetJoinRequestsRequest,
    HandleJoinRequestRequest,
    CancelJoinRequestRequest

} from './../proto/roomzapi_pb';

const client = new RoomzApiServiceClient("http://localhost:8080", null, null);
// This is a neat chrome extension that allows you to spy on grpc-web traffic just like you would on normal traffic.
// You can find it here: https://chrome.google.com/webstore/detail/grpc-web-developer-tools/ddamlpimmiapbcopeoifjfmoabdbfbjj?hl=en
const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
enableDevTools([
  client,
]);


function createAccount(data) {
  var request = new CreateAccountRequest();
  request.setFirstName(data['firstName']);
  request.setLastName(data['lastName']);
  request.setEmail(data['email']);
  request.setPassword(data['password']);
  
  return new Promise((resolve, reject) => {
    client.createAccount(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    })
  });
}

function signIn(data) {
  var request = new SignInRequest();
  request.setEmail(data['email']);
  request.setPassword(data['password']);
  
  return new Promise((resolve, reject) => {
    client.signIn(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function createRoom(data) {
  var request = new CreateRoomRequest();
  request.setUserId(data['userId']);
  request.setUserName(data['userName']);
  request.setPassword(data['password']);
  request.setIsStrict(data['isStrict']);

  return new Promise((resolve, reject) => {
    client.createRoom(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function closeRoom(data) {
  var request = new CloseRoomRequest();
  request.setRoomId(data['roomId']);

  return new Promise((resolve, reject) => {
    client.closeRoom(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function awaitRoomClosure(data) {
  var request = new AwaitRoomClosureRequest();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);
  request.setToken(data['token']);

  return new Promise((resolve, reject) => {
    const closureStream = client.awaitRoomClosure(request, {});

    if (closureStream) {
      resolve(closureStream);
    } else {
      reject(null);
    }
  });
}

function joinRoom(data) {
  var request = new JoinRoomRequest();
  request.setRoomId(data['roomId']);
  request.setRoomPassword(data['roomPassword']);
  request.setUserId(data['userId']);
  request.setUserName(data['userName']);
  request.setIsGuest(data['isGuest']);

  return new Promise((resolve, reject) => {
    const chatStream = client.joinRoom(request, {});
    if (chatStream) {
      resolve(chatStream);
    } else {
      reject(null);
    }
  });
}

function leaveRoom(data) {
  var request = new LeaveRoomRequest();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);

  return new Promise((resolve, reject) => {
    client.leaveRoom(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function enterChatRoom(data) {
  var request = new EnterChatRoomRequest();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);
  request.setToken(data['token']);

  return new Promise((resolve, reject) => {
    // Note: chatStream is a StreamInterceptor object, not a payload of data
    const chatStream = client.enterChatRoom(request, {});

    if (chatStream) {
      resolve(chatStream);
    } else {
      reject(null);
    }
  });
}

function chatMessage(data) {
  var request = new ChatMessage();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);
  request.setUserName(data['username']);
  request.setMessage(data['message']);
  request.setTimestamp(data['timestamp']);

  return new Promise((resolve, reject) => {
    client.sendChatMessage(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function getJoinRequests(data) {
  var request = new GetJoinRequestsRequest();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);

  return new Promise((resolve, reject) => {
    client.getJoinRequests(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function handleJoinRequest(data) {
  var request = new HandleJoinRequestRequest();
  request.setRoomId(data['roomId']);
  request.setUserIdToHandle(data['userIdToHandle']);
  request.setDecision(data['decision']);

  return new Promise((resolve, reject) => {
    client.handleJoinRequest(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}

function cancelJoinRequest(data) {
  var request = new CancelJoinRequestRequest();
  request.setRoomId(data['roomId']);
  request.setUserId(data['userId']);

  return new Promise((resolve, reject) => {
    client.cancelJoinRequest(request, {}, (error, response) => {
      if (response) {
        resolve(response);
      } else if (error) {
        reject(error);
      } else {
        reject(null);
      }
    });
  });
}


export {
  createAccount,
  signIn,
  createRoom,
  closeRoom,
  awaitRoomClosure,
  joinRoom,
  leaveRoom,
  enterChatRoom,
  chatMessage,
  getJoinRequests,
  handleJoinRequest,
  cancelJoinRequest
}