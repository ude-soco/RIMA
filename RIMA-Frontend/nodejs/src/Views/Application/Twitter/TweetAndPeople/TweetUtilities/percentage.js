function filterTweets(tweets) {
  const twt = [];
  for (let tweet of tweets) {
    twt.push(tweet.text);
  }
  return twt;
}

export const calculate_percentage = (strings) => {
  let final_obj = {};
  let counter = 0;
  let tags = [];
  tags = strings.map((string) => string.text);
  counter = tags.length;

  tags.map((el) => {
    if (!final_obj[el]) {
      return (final_obj[el] =
        (tags.filter((ob) => ob === el).length * 100) / counter);
    }
  });

  return final_obj;
};
