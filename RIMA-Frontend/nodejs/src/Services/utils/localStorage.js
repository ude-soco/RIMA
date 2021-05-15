export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    return false;
  }
};

export const getItem = key => {
  try {
    let serializedItem = localStorage.getItem(key);
    if (serializedItem !== undefined || serializedItem !== null) {
      return serializedItem;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};