
import React, { Fragment } from "react";
import AppRoute from "./routes/index";
import { getItem } from "./utils/localStorage";
import { ToastContainer } from 'react-toastify';

export const Theme = React.createContext();

const App = () => {
    const TOKEN = getItem("accessToken");
    const state = {
        TOKEN
    }
    return (<Fragment>
        <Theme.Provider value={state}>
            <AppRoute />
            <ToastContainer autoClose={8000} />
        </Theme.Provider>
    </Fragment>)
};

export default App
