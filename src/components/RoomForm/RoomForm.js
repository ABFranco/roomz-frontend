import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'; 

import RoomCreate from './RoomCreate';
import RoomJoin from './RoomJoin';

function RoomForm() {
  return (
    <Switch>
      <Route path="/room/create">
        <RoomCreate />
      </Route>

      <Route path="/room/join">
        <RoomJoin />
      </Route>
    </Switch>
  );
}

export default RoomForm;