import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './AccountDetails.css';
import * as apiClient from '../api/RoomzApiServiceClient.js'

function EditAccountEmail(props) {
    const history = useHistory();

    const [submitError, setSubmitError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const account_email = useRef();
    
    const old_email = useRef();
    const new_email = useRef();

    function editAccountEmailSubmit() {
        if(old_email.current.value !==  account_email.current.value) {
            //we ensure the emails match here instead of the backend
            setSubmitError(true);
            setErrorMessage("Emails do not match!");
        } else {
            let data = {
                'old_email' : old_email.current.value,
                'new_email' : new_email.current.value
            }

            apiClient.editAccountEmail(data)
                .then(response => {
                    console.log(':editAccountEmailSubmit: response%o', reponse);

                    setSubmitError(false);

                    //go back to account details 
                    history.push("/account/details");
                })
        }
    }
}


function EditAccountPassword(props) {
    const history = useHistory();

    const [submitError, setSubmitError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const account_password = useRef();

    const email = useRef();
    const old_password = useRef();
    const new_password = useRef();

    function editAccountEmailSubmit() {
        //check for correct password is done in the backend 
        let data = {
            'old_email' : old_email.current.value,
            'new_email' : new_email.current.value
        }
        apiClient.editAccountEmail(data)
            .then(response => {
                console.log(':editAccountPasswordSubmit: response%o', reponse);

                setSubmitError(false);

                //go back to account details 
                history.push("/account/details");
            })
    }
}
