function dotProduct(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function magnitude(a) {
  return Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}

export default cosineSimilarity;
// Example usage:
// const array1 = [1, 2, 3];
// const array2 = [4, 5, 6];

// console.log(cosineSimilarity(array1, array2)); // Output: 0.9746318461970762
