import WordleGame, { MatchDegrees } from "./wordleGame";
import { guessableWords, selectableWords } from "./wordLists";
import wordFrequenciesRaw from "./data/wordFrequencies.json";
const wordFrequencies = wordFrequenciesRaw as Record<string, number>;

export interface GuessEvaluation {
    guess: string,
    frequencies: number,
    matches: number,
    elimination: number,
}

export const findOptimalGuess = (
    wordsRemaining: Set<string> = selectableWords
): string => {
    let highEliminationScore = 0;
    let bestGuess = "";

    for (const word of Array.from(wordsRemaining)) {
        const simulatedGame = new WordleGame(6, word);
        const wordScores = evaluateGuess(word, simulatedGame.matchGuess(word), wordsRemaining);
        if (wordScores.elimination > highEliminationScore) {
            highEliminationScore = wordScores.elimination;
            bestGuess = word;
        }
    }

    return bestGuess;
}

export const evaluateGuess = (
    guess: string,
    matches: MatchDegrees[],
    wordsRemaining: Set<string> = selectableWords
): GuessEvaluation => {
    const freqScore = evaluateByGeneralFrequency(guess);
    const matchScore = evaluateByMatches(matches);
    const eliminationScore = evaluateByElimination(
        guess,
        matches,
        wordsRemaining
    );

    return {
        guess: guess,
        frequencies: freqScore,
        matches: matchScore,
        elimination: eliminationScore,
    };
};

const evaluateByGeneralFrequency = (guess: string) => {
    const MAX_FREQUENCY_SCORE = 26296; // computed in a python script. score for "araea".
    let frequencyScore = 0;
    for (const letter of guess.split("")) {
        frequencyScore += wordFrequencies[letter];
    }

    return frequencyScore / MAX_FREQUENCY_SCORE;
};

const evaluateByMatches = (matches: MatchDegrees[]) => {
    const SCORE_MAP = {
        [MatchDegrees.Exact]: 1,
        [MatchDegrees.InWord]: 2 / 3,
        [MatchDegrees.NotInWord]: 0,
    };
    let sum = 0;
    for (const m of matches) {
        sum += SCORE_MAP[m];
    }

    return sum / matches.length;
};

const evaluateByElimination = (
    guess: string,
    matches: MatchDegrees[],
    wordsRemaining: Set<string> = selectableWords
) => {
    const possibleGuesses = getPossibleGuesses(guess, matches, wordsRemaining);
    // - 1 accounts for the game being solved when only one word remains
    const fractionRemaining = (possibleGuesses.size - 1) / (selectableWords.size - 1);
    return 1 - fractionRemaining;
};

export const getPossibleGuesses = (
    guess: string,
    matches: MatchDegrees[],
    wordsRemaining: Set<string> = selectableWords
): Set<string> => {
    const guessChars = guess.split("");

    const possibleGuesses = wordsRemaining;
    const onceFiltered = filterViolatesExactMatches(
        guessChars,
        matches,
        possibleGuesses
    );
    const twiceFiltered = filterViolatesInWord(
        guessChars,
        matches,
        onceFiltered
    );
    const thriceFiltered = filterViolatesNotInWord(
        guessChars,
        matches,
        twiceFiltered
    )
    return thriceFiltered;
};

const getInWordCounts = (
    guessChars: string[],
    matches: MatchDegrees[]
): Record<string, number> => {
    const charCounts: Record<string, number> = {};
    for (let i = 0; i < guessChars.length; i++) {
        if (
            matches[i] == MatchDegrees.InWord ||
            matches[i] == MatchDegrees.Exact // if exact then the char is still in the word
        ) {
            const char = guessChars[i];
            if (charCounts[char] == null) {
                charCounts[char] = 1;
            } else {
                charCounts[char] = charCounts[char] + 1;
            }
        }
    }

    return charCounts;
};

const filterViolatesInWord = (
    guessChars: string[],
    matches: MatchDegrees[],
    wordsRemaining: Set<string>
): Set<string> => {
    const inGuessCounts = getInWordCounts(guessChars, matches);
    const validWords = new Set<string>();
    wordsRemaining.forEach((possibleWord) => {
        const possibleWordCounts = countChars(possibleWord);
        let hasAllInWord = true;
        for (let char in inGuessCounts) {
            const countInPossibleWord = possibleWordCounts[char];
            const countInGuess = inGuessCounts[char];
            if (
                countInPossibleWord == null ||
                countInPossibleWord < countInGuess
            ) {
                hasAllInWord = false;
            }
        }

        if (hasAllInWord) {
            validWords.add(possibleWord);
        }
    });

    return validWords;
};

const filterViolatesNotInWord = (
    guessChars: string[],
    matches: MatchDegrees[],
    wordsRemaining: Set<string>
) => {
    const charsNotInWord = getCharsNotInWord(matches, guessChars);
    const validWords = new Set<string>();

    for (const word of Array.from(wordsRemaining)) {
        const wordCharCounts = countChars(word);
        let isValid = true;
        for (const char of Array.from(charsNotInWord)) {
            if (wordCharCounts[char] != null) {
                isValid = false;
            }
        }

        if (isValid) {
            validWords.add(word);
        }
    }

    return validWords;
};

function getCharsNotInWord(matches: MatchDegrees[], guessChars: string[]) {
    const charsNotInWord = new Set<string>();
    for (let i = 0; i < matches.length; i++) {
        if (matches[i] == MatchDegrees.NotInWord) {
            charsNotInWord.add(guessChars[i]);
        }
    }

    return charsNotInWord;
}

const countChars = (word: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    word.split("").forEach((char) => {
        if (counts[char] != null) {
            counts[char] = counts[char] + 1;
        } else {
            counts[char] = 1;
        }
    });

    return counts;
};

const filterViolatesExactMatches = (
    guessChars: string[],
    matches: MatchDegrees[],
    wordsRemaining: Set<string>
) => {
    const matchIndices: number[] = getExactMatchIndices(guessChars, matches);
    const withExactMatches = new Set<string>();
    wordsRemaining.forEach((word) => {
        let hasAllExact = true;
        matchIndices.forEach((matchIndex) => {
            if (guessChars[matchIndex] != word.charAt(matchIndex)) {
                hasAllExact = false;
            }
        });
        if (hasAllExact) {
            withExactMatches.add(word);
        }
    });

    return withExactMatches;
};

const getExactMatchIndices = (
    guessChars: string[],
    matches: MatchDegrees[]
) => {
    const matchIndices = [] as number[];
    for (let i = 0; i < guessChars.length; i++) {
        if (matches[i] == MatchDegrees.Exact) {
            matchIndices.push(i);
        }
    }

    return matchIndices;
};
