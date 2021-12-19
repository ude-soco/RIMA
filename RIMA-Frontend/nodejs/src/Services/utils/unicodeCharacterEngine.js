export function convertUnicode(input) {
  return input.replace(/\\u(\w{4,4})/g, function (a, b) {
    var charcode = parseInt(b, 16);
    return String.fromCharCode(charcode);
  });
}

//Yasmin changed KeywordHighlighter
export function keywordHighlighter(searchMask, text, percentage, compare) {
  let regEx = new RegExp(`(${searchMask})(?!(.(?!<b))*<\/b>)`, "i");
  let replaceMask = `<b class="tooltipA" data-toggle="tooltip" data-placement="top" >${searchMask}<span>${percentage}% similar to ${compare}</span></b>`;
  if (typeof text !== "undefined") {
    text = unescape(text.replace(regEx, replaceMask));
  }
  return text;
}

export function UrlHighlighter(text) {
  var expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  // let replaceMask = `<span style="color : tomato">${searchMask}</span>`;
  console.log("text: ", text);
  const found = text.match(regex);

  if (typeof found !== "undefined") {
    console.log("Found : ", found);
  }
  console.log("Matches", found);
}
