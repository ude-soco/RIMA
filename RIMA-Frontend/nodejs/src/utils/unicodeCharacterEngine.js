export function convertUnicode(input) {
  return input.replace(/\\u(\w{4,4})/g, function (a, b) {
    var charcode = parseInt(b, 16);
    return String.fromCharCode(charcode);
  });
}

export function keywordHighlighter(searchMask, text) {
  let regEx = new RegExp(searchMask, "ig");
  let replaceMask = `<span style="font-weight:600">${searchMask}</span>`;
  if (typeof text !== "undefined") {
    text = unescape(text.replace(regEx, replaceMask));
  }
  return text;
}

export function UrlHighlighter(text) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  // let replaceMask = `<span style="color : tomato">${searchMask}</span>`;
  console.log("text: ", text);
  const found = text.match(regex);

  if (typeof found !== "undefined") {
    console.log("Found : ", found);
  }
  console.log("Matches", found);
}
