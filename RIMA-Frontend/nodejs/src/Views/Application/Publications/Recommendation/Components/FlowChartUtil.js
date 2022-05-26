// const textMetrics = require("text-metrics");
// const el = document.querySelector("h5");
// const metrics = textMetrics.init(el);

const __measuretext_cache__ = {};
function getMaxMeasure(node, sizeOnCtx) {
  const cy = node.cy();
  cy._private.MaxMeasure = cy._private.MaxMeasure || { width: 0, height: 0 };
  cy._private.MaxMeasure.width = Math.max(
    cy._private.MaxMeasure.width,
    sizeOnCtx.width
  );
  cy._private.MaxMeasure.height = Math.max(
    cy._private.MaxMeasure.height,
    sizeOnCtx.height
  );
  return cy._private.MaxMeasure;
}
export function getSize(node, calcHeight, justMax) {
  const label = node.data("label");
  const fStyle = node.pstyle("font-style").strValue;
  const size = node.pstyle("font-size").pfValue + "px";
  const family = node.pstyle("font-family").strValue;
  const weight = node.pstyle("font-weight").strValue;
  // This global variable is used to cache repeated calls with the same arguments
  const _cacheKey = `${label}:${fStyle}:${size}:${family}:${weight}:${calcHeight}`;
  if (__measuretext_cache__[_cacheKey]) {
    return !justMax
      ? __measuretext_cache__[_cacheKey]
      : getMaxMeasure(node, __measuretext_cache__[_cacheKey]);
  }
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = fStyle + " " + weight + " " + size + " " + family;

  // For multiple lines, evaluate the width of the largest line
  const lines = label.replaceAll(" ", "\n").split("\n");
  const lengths = lines.map((a) => a.length);
  const max_line = lengths.indexOf(Math.max(...lengths));
  const sizeOnCtx = ctx.measureText(lines[max_line]);
  if (!!calcHeight) {
    sizeOnCtx.height =
      (sizeOnCtx.fontBoundingBoxAscent + sizeOnCtx.fontBoundingBoxDescent) *
      lines.length;
  }

  // Add the sizes to the cache
  __measuretext_cache__[_cacheKey] = sizeOnCtx;

  return !justMax ? sizeOnCtx : getMaxMeasure(node, sizeOnCtx);
}

export function getHeight(padding, ratio, justMax) {
  return (node) =>
    getSize(node, true, justMax).height * (ratio || 1) + (padding || 10);
}

export function getWidth(padding, ratio, justMax) {
  return (node) =>
    Math.round(
      getSize(node, true, justMax).width * (ratio || 1) + (padding || 10)
    );
}

export function getMaxWidthHeight(padding, ratio, justMax) {
  return (node) => {
    const size = getSize(node, true, justMax);
    const radius =
      Math.round(Math.max(size.width, size.height || 0) * (ratio || 1)) +
      (padding || 10);
    return radius;
  };
}

export function wordElementProvider(
  words,
  prefix,
  isSplit,
  inclEmbedding,
  modelLable
) {
  let wordElements = [];
  const modelId = prefix + "Model";
  let wAvgId = null;
  if (inclEmbedding) {
    wAvgId = prefix + "Avg";
    const wordlable = `${modelLable}`;
    wordElements.push({
      // classes: "circlenode",
      classes: "polygonnode",
      data: {
        id: modelId,
        label: wordlable,
        faveColor: "black",
        faveColorLabel: "black",
      },
      style: {
        "border-style": "dashed",
        "font-weight": "bold",
        "font-size": "17",
      },
    });
    const avglable = `WEIGHTED AVERAGE`;
    wordElements.push(
      {
        classes: "recnode",
        data: {
          id: wAvgId,
          label: avglable,
          faveColor: "black",
          faveColorLabel: "black",
        },
        style: {
          "font-weight": "bold",
          "font-size": "17",
        },
      },
      // edges
      {
        data: {
          source: wAvgId,
          target: modelId,
          label: "",
          faveColor: "black",
        },
        style: {
          "line-style": "dashed",
        },
      }
    );
  }
  words.forEach((word, index) => {
    const texts = word.text.split(" ");
    const wordlable = `${word.text} (${word.weight})`;
    const wordId = `${prefix}wordName${index}`;
    let avgWordId = null;
    if (isSplit && texts.length > 1) {
      // console.log(texts);
      if (!!inclEmbedding) {
        avgWordId = `${prefix}AvgWordName${index}`;
      }
      texts.forEach((text, subIndex) => {
        const subwordId = `${prefix}wordName${index}_${subIndex}`;

        wordElements.push(
          {
            //classes: "circlenode",
            classes: "polygonnode",
            data: {
              id: subwordId,
              label: text,
              faveColor: word.color,
              faveColorLabel: "black",
            },
          },
          // edges
          {
            data: {
              source: wordId,
              target: subwordId,
              label: "",
              faveColor: word.color,
            },
          }
        );
        if (!!avgWordId) {
          wordElements.push(
            // edges
            {
              data: {
                source: subwordId,
                target: avgWordId,
                label: "",
                faveColor: word.color,
              },
            }
          );
        }
      });
    }
    // Keyphrase to Keyword link
    wordElements.push({
      //classes: "circlenode",
      classes: "polygonnode",
      data: {
        id: wordId,
        label: wordlable,
        faveColor: word.color,
        faveColorLabel: "black", //word.color,
      },
      style: {
        "border-style": "dashed",
      },
    });
    // edges
    if (!!wAvgId) {
      if (!!avgWordId) {
        wordElements.push({
          //classes: "circlenode",
          classes: "polygonnode",
          data: {
            id: avgWordId,
            label: wordlable,
            faveColor: word.color,
            faveColorLabel: "black", //word.color,
          },
          style: {
            "border-style": "dashed",
          },
        });
      }
      wordElements.push({
        data: {
          source: avgWordId || wordId,
          target: wAvgId,
          label: "",
          faveColor: word.color,
        },
        style: {
          "line-style": "dashed",
        },
      });
    }
  });
  return wordElements;
}
export function getFinalElement(
  prefixLeft,
  titleLeft,
  prefixRight,
  titleRight,
  cosineSim,
  score
) {
  const scoreId = "scoreNode";
  const cosineSimId = "COSINE SIMILARITY";
  const leftNodeId = prefixLeft + "Model";
  const rightNodeId = prefixRight + "Model";
  return [
    {
      classes: "polygonnode",
      data: {
        id: scoreId,
        label: score,
        faveColor: "black",
        faveColorLabel: "black",
      },
      position: {
        x: 180,
        y: 300,
      },
      style: {
          "font-size" : "17",
          "font-weight": "bold"

        },
    },
    {
      classes: "recnode",
      data: {
        id: cosineSimId,
        label: cosineSim,
        faveColor: "black",
        faveColorLabel: "black",
        tooltip:
          "<p>A publication keyword<br />extracted from the<br />current publication</p>",
        lock: true,
      },
      position: {
        x: 180,
        y: 180,
      },
      style: {
          "font-weight": "bold",
          "font-size" : "17",
          "background-image": "https://i.ibb.co/Jkck6R5/info-2-48.png",
          "background-fit": "cover",
          "background-position": "left top",
          "background-image-opacity": 0.7,
 },
    },
    {
      //classes: "circlenode",
      classes: "polygonnode",
      data: {
        id: leftNodeId,
        label: titleLeft,
        faveColor: "#303F9F",
        faveColorLabel: "black",
      },
      position: {
        x: 30,
        y: 30,
      },
      style: {
        "border-style": "dashed",
      },
    },
    {
      //classes: "circlenode",
      classes: "polygonnode",
      data: {
        id: rightNodeId,
        label: titleRight,
        faveColor: "#F39617",
        faveColorLabel: "black",
      },
      position: {
        x: 330,
        y: 30,
      },
      style: {
        "border-style": "dashed",
      },
    },
    {
      data: {
        source: leftNodeId,
        target: cosineSimId,
        label: "",
        faveColor: "black",
      },
      style: {
        "line-style": "dashed",
      },
    },
    {
      data: {
        source: rightNodeId,
        target: cosineSimId,
        label: "",
        faveColor: "black",
      },
      style: {
        "line-style": "dashed",
      },
    },
    {
      data: {
        source: cosineSimId,
        target: scoreId,
        label: "",
        faveColor: "black",
      },
      style: {
        "line-style": "solid",
      },
    },
  ];
}
export function CalcMaxkeyword(paper, interests) {
  for (let p1 in paper.keywords_similarity) {
    let tInterests = paper.keywords_similarity[p1];
    let max_score = 0;
    let max_interest = "";
    let max_interest_color = "";
    for (let p2 in tInterests) {
      if (p2.toLowerCase().indexOf("data_") >= 0) {
        continue;
      }
      let value = tInterests[p2];
      tInterests[p2] = {
        ...value,
        color:
          value.color ||
          interests.find((x) => x.text.toLowerCase() === p2.toLowerCase())
            .color,
      };
      if (max_score < value.score) {
        max_score = value.score;
        max_interest_color = value.color;
        max_interest = p2;
      }
    }
    if (max_score > 0) {
      paper.keywords_similarity[p1] = {
        ...tInterests,
        data_max_score: max_score,
        data_max_interest: max_interest,
        data_max_interest_color: max_interest_color,
      };
    }
  }
}

export function getKeywordScore(keywords) {
  let items = [];
  if (!keywords) return [{ keyword: "", score: 0, color: "" }];
  let i = 0;
  for (let p2 in keywords) {
    let value = keywords[p2];
    items.push({
      keyword: p2,
      text: p2,
      score: value.data_max_score,
      weight: value.data_weight,
      color: value.data_max_interest_color,
    });
  }
  return items.sort((a, b) =>
    a.score < b.score ? 1 : a.score == b.score ? 0 : -1
  );
}
