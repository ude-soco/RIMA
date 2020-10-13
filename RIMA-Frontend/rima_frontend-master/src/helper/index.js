
import { getItem } from "../utils/localStorage";
import moment from "moment";

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

export const checkLogin = () => {
  const TOKEN = getItem("auth_token");
  if (TOKEN !== undefined || TOKEN !== null) {
    return false;
  } else {
    return true;
  }
};

export function convertDateTimeFormat(datestring) {
  if (datestring !== null && datestring !== "") {
    return datestring.substr(5, 2) + "/" + datestring.substr(8, 2) + "/" + datestring.substr(0, 4);
  } else {
    return "N/A";
  }
}

export function format(datetime, formatter, givenFormatter) {
  let givenTimezoneOffset = moment.parseZone(datetime).utcOffset();

  if (givenTimezoneOffset !== 0) {
    return moment(datetime, givenFormatter)
      .utcOffset(givenTimezoneOffset)
      .format(formatter);
  } else {
  }
}

export function parseDate(date) {
  if (!date) return null;
  const dateComponent = format(new Date(date), "MMM D");
  return dateComponent;
}

export function mmddyy(value) {
  const dateComponent = format(new Date(value), "MM/DD/YYYY");
  return dateComponent;
}