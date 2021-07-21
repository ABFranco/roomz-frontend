import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'; 

import AccountCreate from './AccountCreate';
import AccountDetailsHome from './AccountDetails/AccountDetailsHome.js';
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

      <Route path="/account/details">
        <AccountDetailsHome />
      </Route>
    </Switch>
  );
}

export default AccountForm;