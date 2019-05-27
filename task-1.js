/**
 * @param {any} value
 * @param {number} minValue
 * @param {number} maxValue
 */
function validateInteger(value, minValue, maxValue) {
  return Number.isInteger(value) && value >= minValue && value <= maxValue;
}

/**
 * @param {any[]} array
 * @param {number} num
 * @returns {number[] | null}
 */
function justAddOne(array, num) {
  /**
   * @type {string}
   */
  let sumStr = '';

  for (const item of array) {
    if (!validateInteger(item, 0, 9)) {
      return null;
    }

    sumStr += item.toString();
  }

  return (Number(sumStr) + num)
    .toString()
    .split('')
    .map(Number);
}

console.log(justAddOne([1, 0, 9], 2)); // [1, 1, 1]
console.log(justAddOne([2, 5, 1], 5)); // [2, 5, 6]
console.log(justAddOne([1], 4020)); // [4, 0, 2, 1]
console.log(justAddOne([1, '4', 11, null], 1)); // null
