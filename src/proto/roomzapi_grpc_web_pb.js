/**
 * @fileoverview gRPC-Web generated client stub for roomzpb.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.roomzpb = {};
proto.roomzpb.v1 = require('./roomzapi_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.roomzpb.v1.RoomzApiServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.CreateAccountRequest,
 *   !proto.roomzpb.v1.CreateAccountResponse>}
 */
const methodDescriptor_RoomzApiService_CreateAccount = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/CreateAccount',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.CreateAccountRequest,
  proto.roomzpb.v1.CreateAccountResponse,
  /**
   * @param {!proto.roomzpb.v1.CreateAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CreateAccountResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.CreateAccountRequest,
 *   !proto.roomzpb.v1.CreateAccountResponse>}
 */
const methodInfo_RoomzApiService_CreateAccount = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.CreateAccountResponse,
  /**
   * @param {!proto.roomzpb.v1.CreateAccountRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CreateAccountResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.CreateAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.CreateAccountResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.CreateAccountResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.createAccount =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CreateAccount',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CreateAccount,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.CreateAccountRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.CreateAccountResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.createAccount =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CreateAccount',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CreateAccount);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.SignInRequest,
 *   !proto.roomzpb.v1.SignInResponse>}
 */
const methodDescriptor_RoomzApiService_SignIn = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/SignIn',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.SignInRequest,
  proto.roomzpb.v1.SignInResponse,
  /**
   * @param {!proto.roomzpb.v1.SignInRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.SignInResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.SignInRequest,
 *   !proto.roomzpb.v1.SignInResponse>}
 */
const methodInfo_RoomzApiService_SignIn = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.SignInResponse,
  /**
   * @param {!proto.roomzpb.v1.SignInRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.SignInResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.SignInRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.SignInResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.SignInResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.signIn =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/SignIn',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_SignIn,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.SignInRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.SignInResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.signIn =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/SignIn',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_SignIn);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.CreateRoomRequest,
 *   !proto.roomzpb.v1.CreateRoomResponse>}
 */
const methodDescriptor_RoomzApiService_CreateRoom = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/CreateRoom',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.CreateRoomRequest,
  proto.roomzpb.v1.CreateRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.CreateRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CreateRoomResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.CreateRoomRequest,
 *   !proto.roomzpb.v1.CreateRoomResponse>}
 */
const methodInfo_RoomzApiService_CreateRoom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.CreateRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.CreateRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CreateRoomResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.CreateRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.CreateRoomResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.CreateRoomResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.createRoom =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CreateRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CreateRoom,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.CreateRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.CreateRoomResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.createRoom =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CreateRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CreateRoom);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.CloseRoomRequest,
 *   !proto.roomzpb.v1.CloseRoomResponse>}
 */
const methodDescriptor_RoomzApiService_CloseRoom = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/CloseRoom',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.CloseRoomRequest,
  proto.roomzpb.v1.CloseRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.CloseRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CloseRoomResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.CloseRoomRequest,
 *   !proto.roomzpb.v1.CloseRoomResponse>}
 */
const methodInfo_RoomzApiService_CloseRoom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.CloseRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.CloseRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CloseRoomResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.CloseRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.CloseRoomResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.CloseRoomResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.closeRoom =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CloseRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CloseRoom,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.CloseRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.CloseRoomResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.closeRoom =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CloseRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CloseRoom);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.AwaitRoomClosureRequest,
 *   !proto.roomzpb.v1.HostClosedRoom>}
 */
const methodDescriptor_RoomzApiService_AwaitRoomClosure = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/AwaitRoomClosure',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.roomzpb.v1.AwaitRoomClosureRequest,
  proto.roomzpb.v1.HostClosedRoom,
  /**
   * @param {!proto.roomzpb.v1.AwaitRoomClosureRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.HostClosedRoom.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.AwaitRoomClosureRequest,
 *   !proto.roomzpb.v1.HostClosedRoom>}
 */
const methodInfo_RoomzApiService_AwaitRoomClosure = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.HostClosedRoom,
  /**
   * @param {!proto.roomzpb.v1.AwaitRoomClosureRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.HostClosedRoom.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.AwaitRoomClosureRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.HostClosedRoom>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.awaitRoomClosure =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/AwaitRoomClosure',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_AwaitRoomClosure);
};


/**
 * @param {!proto.roomzpb.v1.AwaitRoomClosureRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.HostClosedRoom>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.awaitRoomClosure =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/AwaitRoomClosure',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_AwaitRoomClosure);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.JoinRoomRequest,
 *   !proto.roomzpb.v1.JoinRoomResponse>}
 */
const methodDescriptor_RoomzApiService_JoinRoom = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/JoinRoom',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.roomzpb.v1.JoinRoomRequest,
  proto.roomzpb.v1.JoinRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.JoinRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.JoinRoomResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.JoinRoomRequest,
 *   !proto.roomzpb.v1.JoinRoomResponse>}
 */
const methodInfo_RoomzApiService_JoinRoom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.JoinRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.JoinRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.JoinRoomResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.JoinRoomRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.JoinRoomResponse>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.joinRoom =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/JoinRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_JoinRoom);
};


/**
 * @param {!proto.roomzpb.v1.JoinRoomRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.JoinRoomResponse>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.joinRoom =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/JoinRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_JoinRoom);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.LeaveRoomRequest,
 *   !proto.roomzpb.v1.LeaveRoomResponse>}
 */
const methodDescriptor_RoomzApiService_LeaveRoom = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/LeaveRoom',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.LeaveRoomRequest,
  proto.roomzpb.v1.LeaveRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.LeaveRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.LeaveRoomResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.LeaveRoomRequest,
 *   !proto.roomzpb.v1.LeaveRoomResponse>}
 */
const methodInfo_RoomzApiService_LeaveRoom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.LeaveRoomResponse,
  /**
   * @param {!proto.roomzpb.v1.LeaveRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.LeaveRoomResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.LeaveRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.LeaveRoomResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.LeaveRoomResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.leaveRoom =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/LeaveRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_LeaveRoom,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.LeaveRoomRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.LeaveRoomResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.leaveRoom =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/LeaveRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_LeaveRoom);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.EnterChatRoomRequest,
 *   !proto.roomzpb.v1.ChatMessage>}
 */
const methodDescriptor_RoomzApiService_EnterChatRoom = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/EnterChatRoom',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.roomzpb.v1.EnterChatRoomRequest,
  proto.roomzpb.v1.ChatMessage,
  /**
   * @param {!proto.roomzpb.v1.EnterChatRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.ChatMessage.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.EnterChatRoomRequest,
 *   !proto.roomzpb.v1.ChatMessage>}
 */
const methodInfo_RoomzApiService_EnterChatRoom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.ChatMessage,
  /**
   * @param {!proto.roomzpb.v1.EnterChatRoomRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.ChatMessage.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.EnterChatRoomRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.ChatMessage>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.enterChatRoom =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/EnterChatRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_EnterChatRoom);
};


/**
 * @param {!proto.roomzpb.v1.EnterChatRoomRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.ChatMessage>}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.enterChatRoom =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/EnterChatRoom',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_EnterChatRoom);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.ChatMessage,
 *   !proto.roomzpb.v1.SendChatMessageResponse>}
 */
const methodDescriptor_RoomzApiService_SendChatMessage = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/SendChatMessage',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.ChatMessage,
  proto.roomzpb.v1.SendChatMessageResponse,
  /**
   * @param {!proto.roomzpb.v1.ChatMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.SendChatMessageResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.ChatMessage,
 *   !proto.roomzpb.v1.SendChatMessageResponse>}
 */
const methodInfo_RoomzApiService_SendChatMessage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.SendChatMessageResponse,
  /**
   * @param {!proto.roomzpb.v1.ChatMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.SendChatMessageResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.ChatMessage} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.SendChatMessageResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.SendChatMessageResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.sendChatMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/SendChatMessage',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_SendChatMessage,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.ChatMessage} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.SendChatMessageResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.sendChatMessage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/SendChatMessage',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_SendChatMessage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.GetJoinRequestsRequest,
 *   !proto.roomzpb.v1.GetJoinRequestsResponse>}
 */
const methodDescriptor_RoomzApiService_GetJoinRequests = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/GetJoinRequests',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.GetJoinRequestsRequest,
  proto.roomzpb.v1.GetJoinRequestsResponse,
  /**
   * @param {!proto.roomzpb.v1.GetJoinRequestsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.GetJoinRequestsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.GetJoinRequestsRequest,
 *   !proto.roomzpb.v1.GetJoinRequestsResponse>}
 */
const methodInfo_RoomzApiService_GetJoinRequests = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.GetJoinRequestsResponse,
  /**
   * @param {!proto.roomzpb.v1.GetJoinRequestsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.GetJoinRequestsResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.GetJoinRequestsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.GetJoinRequestsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.GetJoinRequestsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.getJoinRequests =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/GetJoinRequests',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_GetJoinRequests,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.GetJoinRequestsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.GetJoinRequestsResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.getJoinRequests =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/GetJoinRequests',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_GetJoinRequests);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.HandleJoinRequestRequest,
 *   !proto.roomzpb.v1.HandleJoinRequestResponse>}
 */
const methodDescriptor_RoomzApiService_HandleJoinRequest = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/HandleJoinRequest',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.HandleJoinRequestRequest,
  proto.roomzpb.v1.HandleJoinRequestResponse,
  /**
   * @param {!proto.roomzpb.v1.HandleJoinRequestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.HandleJoinRequestResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.HandleJoinRequestRequest,
 *   !proto.roomzpb.v1.HandleJoinRequestResponse>}
 */
const methodInfo_RoomzApiService_HandleJoinRequest = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.HandleJoinRequestResponse,
  /**
   * @param {!proto.roomzpb.v1.HandleJoinRequestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.HandleJoinRequestResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.HandleJoinRequestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.HandleJoinRequestResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.HandleJoinRequestResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.handleJoinRequest =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/HandleJoinRequest',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_HandleJoinRequest,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.HandleJoinRequestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.HandleJoinRequestResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.handleJoinRequest =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/HandleJoinRequest',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_HandleJoinRequest);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.CancelJoinRequestRequest,
 *   !proto.roomzpb.v1.CancelJoinRequestResponse>}
 */
const methodDescriptor_RoomzApiService_CancelJoinRequest = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/CancelJoinRequest',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.CancelJoinRequestRequest,
  proto.roomzpb.v1.CancelJoinRequestResponse,
  /**
   * @param {!proto.roomzpb.v1.CancelJoinRequestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CancelJoinRequestResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.CancelJoinRequestRequest,
 *   !proto.roomzpb.v1.CancelJoinRequestResponse>}
 */
const methodInfo_RoomzApiService_CancelJoinRequest = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.CancelJoinRequestResponse,
  /**
   * @param {!proto.roomzpb.v1.CancelJoinRequestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.CancelJoinRequestResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.CancelJoinRequestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.CancelJoinRequestResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.CancelJoinRequestResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.cancelJoinRequest =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CancelJoinRequest',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CancelJoinRequest,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.CancelJoinRequestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.CancelJoinRequestResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.cancelJoinRequest =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/CancelJoinRequest',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_CancelJoinRequest);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.roomzpb.v1.UpdateSessionIdRequest,
 *   !proto.roomzpb.v1.UpdateSessionIdResponse>}
 */
const methodDescriptor_RoomzApiService_UpdateSessionId = new grpc.web.MethodDescriptor(
  '/roomzpb.v1.RoomzApiService/UpdateSessionId',
  grpc.web.MethodType.UNARY,
  proto.roomzpb.v1.UpdateSessionIdRequest,
  proto.roomzpb.v1.UpdateSessionIdResponse,
  /**
   * @param {!proto.roomzpb.v1.UpdateSessionIdRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.UpdateSessionIdResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.roomzpb.v1.UpdateSessionIdRequest,
 *   !proto.roomzpb.v1.UpdateSessionIdResponse>}
 */
const methodInfo_RoomzApiService_UpdateSessionId = new grpc.web.AbstractClientBase.MethodInfo(
  proto.roomzpb.v1.UpdateSessionIdResponse,
  /**
   * @param {!proto.roomzpb.v1.UpdateSessionIdRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.roomzpb.v1.UpdateSessionIdResponse.deserializeBinary
);


/**
 * @param {!proto.roomzpb.v1.UpdateSessionIdRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.roomzpb.v1.UpdateSessionIdResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.roomzpb.v1.UpdateSessionIdResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.roomzpb.v1.RoomzApiServiceClient.prototype.updateSessionId =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/UpdateSessionId',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_UpdateSessionId,
      callback);
};


/**
 * @param {!proto.roomzpb.v1.UpdateSessionIdRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.roomzpb.v1.UpdateSessionIdResponse>}
 *     Promise that resolves to the response
 */
proto.roomzpb.v1.RoomzApiServicePromiseClient.prototype.updateSessionId =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/roomzpb.v1.RoomzApiService/UpdateSessionId',
      request,
      metadata || {},
      methodDescriptor_RoomzApiService_UpdateSessionId);
};


module.exports = proto.roomzpb.v1;

