import React from 'react';
import { Switch, Route } from 'react-router-dom'; 

import RoomCreate from './RoomCreate';
import RoomJoin from './RoomJoin';

function RoomForm({roomJoinSubmit}) {
  return (
    <Switch>
      <Route path="/room/create">
        <RoomCreate />
      </Route>

      <Route path="/room/join">
        <RoomJoin roomJoinSubmit={roomJoinSubmit}/>
      </Route>
    </Switch>
  );
}

export default RoomForm;