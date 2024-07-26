import { isValidWord, randomSelectableWord } from "./wordLists";

export enum MatchDegrees {
    Exact,
    InWord,
    NotInWord,
}

class OutOfGuessesError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "CouldNotMakeGuessesError";
    }
}

class InvalidGuessError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "InvalidGuessError";
    }
}

export default class WordleGame {
    private word: string;
    private letterCounts: Record<string, number>;
    private guessesAllowed: number;
    private guesses: string[];
    private guessMatches: MatchDegrees[][];

    constructor(guessesAllowed: number) {
        this.word = randomSelectableWord();
        this.guessesAllowed = guessesAllowed;
        this.letterCounts = this.countCharacters(this.word);
        this.guesses = [];
        this.guessMatches = [];
    }

    makeGuess(guess: string): boolean {
        if (this.guesses.length >= this.guessesAllowed) {
            throw new OutOfGuessesError("All guesses have already been used.");
        } else if (guess.length != this.word.length) {
            throw new InvalidGuessError(
                `Submitted guess of length ${guess.length} is not of length ${this.word.length}.`
            );
        } else if (!this.validateGuessChars(guess)) {
            throw new InvalidGuessError(
                "Guess contained an illegal, non-alphanumeric character."
            );
        } else if (!isValidWord(guess)) {
            throw new InvalidGuessError(
                "Guess is not a valid word."
            );
        }

        this.guesses.push(guess);
        const matches: MatchDegrees[] = this.matchGuess(guess);
        this.guessMatches.push(matches);
        
        return matches.every((m) => (m == MatchDegrees.Exact)) || this.guesses.length >= this.guessesAllowed;
    }

    matchGuess(guess: string): MatchDegrees[] {
        const counts = { ...this.letterCounts };
        const matches: MatchDegrees[] = new Array(this.word.length);
        for (let i = 0; i < this.word.length; i++) {
            const letter: string = guess.charAt(i);
            matches[i] = this.matchLetter(letter, i, counts);
        }

        return matches;
    }

    private matchLetter(
        letter: string,
        index: number,
        counts: Record<string, number>
    ): MatchDegrees {
        if (letter == this.word.charAt(index)) {
            counts[letter]--;
            return MatchDegrees.Exact;
        }

        const wordArr = this.word.split("");
        if (wordArr.includes(letter) && counts[letter] != 0) {
            counts[letter]--;
            return MatchDegrees.InWord;
        }

        return MatchDegrees.NotInWord;
    }

    private countCharacters(str: string): Record<string, number> {
        const counts: Record<string, number> = {};
        const strArr = str.split("");

        strArr.forEach((char) => {
            if (counts[char] != null) {
                counts[char]++;
            } else {
                counts[char] = 1;
            }
        });
        return counts;
    }

    private validateGuessChars(guess: string): boolean {
        const invalidCharMatches = guess.match(/[^a-zA-Z]/g); // matches non-alpha chars
        return invalidCharMatches == null;
    }

    getWord(): string {
        return this.word;
    }

    getGuessesAllowed(): number {
        return this.guessesAllowed;
    }

    getGuesses(): string[] {
        return [...this.guesses]; // shallow copy of guesses
    }

    getGuessMatches(): MatchDegrees[][] {
        return [...this.guessMatches];
    }
}
