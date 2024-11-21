/* eslint-disable no-prototype-builtins */
// AI Generated convertor from words to numbers.

const NUMBERS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const MULTIPLIERS: Record<string, number> = {
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
};

function wordToNumber(words: string) {
  // Normalize input
  words = words
    .toLowerCase()
    .replace(/\band\b/g, '')
    .trim();

  // Split words, removing extra spaces
  const parts = words.split(/\s+|-/).filter(Boolean);

  let total = 0;
  let currentNumber = 0;
  for (let i = 0; i < parts.length; i++) {
    const word = parts[i];

    // Check if word is a base number (0-90)
    if (NUMBERS.hasOwnProperty(word)) {
      currentNumber += NUMBERS[word];
    }
    // Check if word is a multiplier
    else if (MULTIPLIERS.hasOwnProperty(word)) {
      const multiplier = MULTIPLIERS[word];

      // Handle cases like "one hundred", "two thousand"
      if (currentNumber === 0) currentNumber = 1;

      currentNumber *= multiplier;

      // If we've hit a large multiplier, add to total and reset
      if (multiplier >= 100) {
        total += currentNumber;
        currentNumber = 0;
      }
    }
    // Invalid word
    else {
      return null;
    }
  }

  return total + currentNumber;
}

export default wordToNumber;
