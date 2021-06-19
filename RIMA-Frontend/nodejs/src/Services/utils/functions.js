export function getRandomColor() {
  let letters = '012345'.split('');
  let color = '#';
  color += letters[Math.round(Math.random() * 5)];
  letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

export function toFirstLetter(name) {
  return ((name || "").charAt(0) || "").toUpperCase()
}

export function getColorArray(length) {
  let array = []
  for (let n = 0; n < length; n++) {
    array.push('#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6));
  }
  return array;
}

export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem("rimaUser"))
}
