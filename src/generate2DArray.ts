export const generate2DGrid = (wallLength: number) => {
  // Generate array
  const numArray = Array.from(Array(wallLength * wallLength).keys());
  const numberPairsArray = numArray.map((num) => {
    return Math.ceil((num + 1) / 2);
  });
  // Random sort the array
  numberPairsArray.sort((a, b) => 0.5 - Math.random());

  // Create objects from numbers
  const numberObjectArray = numberPairsArray.map((num, idx) => {
    return {
      id: idx + 1,
      value: num,
      guessed: false,
      opened: false,
      disabled: false,
    };
  });

  // Create 2D array
  const twoDArray = [];

  while (numberObjectArray.length > 0) {
    let chunk = numberObjectArray.splice(0, wallLength);
    twoDArray.push(chunk);
  }

  return twoDArray;
};
