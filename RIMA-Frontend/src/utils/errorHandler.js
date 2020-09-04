import { toast } from 'react-toastify';

export const handleServerErrors = (error, enqueueSnackbar, defaultMsg = "Something went wrong. Try again.") => {
   
    try {
        if (error && error.response && error.response.status === 401) {
            // enqueueSnackbar("Session expired. Login Again");
        } else if (error && error.response && error.response.status === 400 && error.response.data) {
            const error_data = getErrorData(error.response.message ? error.response.message : error);
            let error_message = defaultMsg;
            const error_key = Object.keys(error_data)[0] || "";
            if (typeof error_data === 'object') error_message = `${titleCase(error_key.replace(/_/g, ' '))}: ${error_data[error_key]}`;
            else error_message = error_data
            enqueueSnackbar(error_message, { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
        } else {
            enqueueSnackbar(defaultMsg, { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
        }
    } catch (error) {
        enqueueSnackbar(defaultMsg, { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 });
    }


}

const getErrorData = (error) => {
    let error_data = [];
    if (error.response.data.message && Object.keys(error.response.data.message).length) {
        error_data = error.response.data.message;
    } else if (Object.keys(error.response.data).length) {
        error_data = error.response.data;
    }
    return error_data;
}

export const titleCase = (string) => {
    var sentence = string.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    if (sentence[0] === 'Address') {
        return sentence[0]
    }
    else {
        return sentence.join(" ");
    }
}