const __measuretext_cache__ = {};

/**
 * Get maximum size of a node
 * @param {object} node Node object of cytoscape
 * @param {object} sizeOnCtx The size of the node's text in a temp canvas' context
 * @returns Maximum node size
 */
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

/**
 * Calculate the size of a node depends on the node's text
 * @param {object} node Node object of the cytoscape
 * @param {boolean} calcHeight If true calculate also node's height
 * @param {boolean} justMax If true used the size of biggest node
 * @returns
 */
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

/**
 * Return the height of the nodes
 * @param {number} padding It's used the padding in the height calculateion
 * @param {number} ratio It's used the ratio in the height calculateion
 * @param {boolean} justMax If true used the size of biggest node
 * @returns
 */
export function getHeight(padding, ratio, justMax) {
  return (node) =>
    getSize(node, true, justMax).height * (ratio || 1) + (padding || 10);
}

/**
 * Return the width of the nodes
 * @param {number} padding It's used the padding in the width calculateion
 * @param {number} ratio It's used the ratio in the width calculateion
 * @param {boolean} justMax If true used the size of biggest node
 * @returns
 */
export function getWidth(padding, ratio, justMax) {
  return (node) =>
    Math.round(
      getSize(node, true, justMax).width * (ratio || 1) + (padding || 10)
    );
}

/**
 * Provide all nodes depend on the given words
 * @param {Array<string>} words List of interest model or publication keywords
 * @param {string} prefix It's used in the generated id
 * @param {boolean} inclEmbedding If True, add Weighted average and Embedding nodes
 * @param {string} modelLable The label of Embedding node. It is used when incEmbedding is True
 * @returns List of nodes
 */
export function wordElementProviderWithCoordinate(
  words,
  prefix,
  inclEmbedding,
  modelLable
) {
  // Visualization for 'GENERATE EMBEDDINGS' step
  let wordElements = [];
  let modelObj = null;
  let wAvgObj = null;
  let wParentObj = null;
  wParentObj = {
    data: {
      id: prefix + "Parent",
      label: "",
      faveColor: "white",
      faveColorLabel: "black",
    },
    style: {
      "border-style": "solid",
      opacity: "0.80",
    },
  };

  wordElements.push(wParentObj);
  if (inclEmbedding) {
    const wordlable = `${modelLable}`;
    modelObj = {
      classes: "polygonnode",
      data: {
        id: prefix + "Model",
        label: wordlable,
        faveColor: "black",
        faveColorLabel: "black",
      },
      style: {
        "border-style": "dashed",
        "font-weight": "bold",
        "font-size": "17",
      },
    };

    wordElements.push(modelObj);

    const avglable = `WEIGHTED AVERAGE`;

    wAvgObj = {
      classes: "recnode",
      data: {
        id: prefix + "Avg",
        label: avglable,
        faveColor: "black",
        faveColorLabel: "black",
      },
      style: {
        "font-weight": "bold",
        "font-size": "17",
      },
    };

    wordElements.push(wAvgObj);

    wordElements.push(
      // edges
      {
        data: {
          source: wAvgObj.data.id,
          target: modelObj.data.id,
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
    let wordObj = null;
    const wordlable = `${word.text} (${word.weight})`;
    wordObj = {
      classes: "polygonnode",
      data: {
        id: `${prefix}wordName${index}`,
        label: wordlable,
        faveColor: word.color,
        faveColorLabel: "black",
        parent: wParentObj.data.id,
      },
      // Put couple nodes per line
      position: {
        x: 200 * (index % 2),
        y: 100 * Math.round(index / 2 - 0.1),
      },
      style: {
        "border-style": inclEmbedding ? "dashed" : "solid",
      },
    };
    wordElements.push(wordObj);
    // edges
    if (!!wAvgObj) {
      wordElements.push({
        data: {
          source: wordObj.data.id,
          target: wAvgObj.data.id,
          label: "",
          faveColor: word.color,
          transparent: 1,
        },
        style: {
          "line-style": "dashed",
        },
      });
    }
  });
  if (!!wAvgObj) {
    wAvgObj.position = {
      x: 100,
      y: 100 * Math.round(words.length / 2) + 80,
    };
    modelObj.position = {
      x: wAvgObj.position.x,
      y: wAvgObj.position.y + 150,
    };
  }
  return wordElements;
}

/**
 * Provide all nodes for final step of How explanation
 * @param {string} prefixLeft It's Used in the generated id
 * @param {string} titleLeft Titel of left node
 * @param {string} prefixRight It's used in the generated id
 * @param {string} titleRight Titel of right node
 * @param {string} cosineSim Titel of middle node
 * @param {number} score Similarity score was shown in the last button node
 * @returns List of nodes
 */
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
        "font-size": "17",
        "font-weight": "bold",
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
          "<p>Similarity is calculated<br />using cosine similarity<br />between the embeddings</p>",
        lock: true,
      },
      position: {
        x: 180,
        y: 180,
      },
      style: {
        "font-weight": "bold",
        "font-size": "17",
        "background-image": "https://i.ibb.co/Jkck6R5/info-2-48.png",
        "background-fit": "cover",
        "background-position": "left top",
        "background-image-opacity": 0.7,
        height: 70,
        width: 150,
      },
    },
    {
      //classes: "circlenode",
      classes: "polygonnode",
      data: {
        id: leftNodeId,
        label: titleLeft,
        faveColor: "black",
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
        faveColor: "black",
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

/**
 * Calculate the maximum keyword similarity and score
 * @param {object} paper Paper object
 * @param {Array<string>} interests List of interests
 */
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

/**
 * Set the maximum silimaliry of interest for each publication keywords as a keyword score and set It's color
 * @param {object} keywords Publication keywords
 * @returns List of colored keyword scores
 */
export function getKeywordScore(keywords) {
  let items = [];
  if (!keywords) return [{ keyword: "", score: 0, color: "" }];
  //Convert object to the list
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
