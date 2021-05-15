import React, { Fragment } from "react";
import { getItem } from "./Services/utils/localStorage";
import { ToastContainer } from 'react-toastify';
import Routing from "./Routing/Routing"


export const Theme = React.createContext();

export default function App () {
    const TOKEN = getItem("accessToken");
    const state = {
        TOKEN
    }
    return (<Fragment>
        <Theme.Provider value={state}>
            <Routing />
            <ToastContainer autoClose={8000} />
        </Theme.Provider>
    </Fragment>)
};
