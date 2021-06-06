import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'; 

import AccountDetails from './AccountDetails.js';
import EditAccountEmail from './EditAccountEmail/EditAccountEmail.js';
import EditAccountPassword from './EditAccountPassword/EditAccountPassword.js';

function AccountDetailsHome() {
    return (
        <Switch>
            <Route path="/account/details/email">
                <EditAccountEmail />
            </Route>
            <Route path="/account/details/password">
                <EditAccountPassword />
            </Route>
            <Route path="/account/details">
                <AccountDetails />
            </Route>
        </Switch>
    )
}

export default AccountDetailsHome;
