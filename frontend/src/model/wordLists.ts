// word list adapted from https://www.rockpapershotgun.com/wordle-past-answers (Toms 2024).
import selectableWordsArr from "./data/selectableWords.json";

// word list adapated from https://gist.github.com/kcwhite/bb598f1b3017b5477cb818c9b086a5d9#file-wordle_possibles-txt-L3.
import guessableWordsArr from "./data/guessableWords.json";

export const selectableWords = new Set(selectableWordsArr);
export const guessableWords = new Set(guessableWordsArr);

export const randomSelectableWord = (): string => selectableWordsArr[Math.floor(Math.random() * selectableWordsArr.length)];

export const isValidWord = (word: string): boolean => guessableWords.has(word);