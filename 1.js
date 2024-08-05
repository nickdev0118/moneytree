// Algorithmic Question - Joining Overlapping Arrays

// Background: In LINK Data we often deal with financial transaction histories. If we scrape the same account multiple times a day, the data set we get the
// second time may include data we have already aggregated. We need to be able to safely and predictably deduplicate the transactions we receive.

// Problem: Given two input arrays containing sequences of integers which may overlap, produce a merged, de-duplicated output array. You may assume
// that the input parameters are always one-dimensional arrays of integers. The input arrays may be of arbitrary length.

function joinArrays(input1, input2) {
  let duplicate_cnt = 0;

  // Find the duplicating part
  for (let i = 0; i < input2.length; i++) {
    let subArray = input2.slice(0, i + 1);
    let subArrayStr = subArray.join('');
    let input1Str = input1.slice(-subArray.length).join('');

    if (input1Str === subArrayStr) {
      duplicate_cnt = i + 1;
    }
  }

  // Merge the arrays by excluding the overlapping part from the second array
  const result = input1.concat(input2.slice(duplicate_cnt));
  return result;
}

// Test cases
console.log(joinArrays([1, 2, 3, 4], [3, 4, 5, 6])); // [1, 2, 3, 4, 5, 6]
console.log(joinArrays([1, 2, 3, 4], [5, 6, 7, 8])); // [1, 2, 3, 4, 5, 6, 7, 8]
console.log(joinArrays([1, 2, 1, 2], [1, 2, 7, 8])); // [1, 2, 1, 2, 7, 8]
console.log(joinArrays([5, 5, 1, 2], [5, 1, 7, 8])); // [5, 5, 1, 2, 5, 1, 7, 8]
console.log(joinArrays([3, 1, 2], [2, 1, 3])); // [3, 1, 2, 1, 3]