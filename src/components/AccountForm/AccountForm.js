import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'; 

import AccountCreate from './AccountCreate';
import AccountLogin from './AccountLogin';

function AccountForm() {
  return (
    <Switch>
      <Route path="/account/create">
        <AccountCreate />
      </Route>

      <Route path="/account/login">
        <AccountLogin />
      </Route>
    </Switch>
  );
}

export default AccountForm;