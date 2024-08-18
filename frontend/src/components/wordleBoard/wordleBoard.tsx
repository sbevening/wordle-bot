import { FC, useState } from "react";

import "./wordleBoard.css";
import WordleGame from "../../model/wordleGame";
import { MatchDegrees } from "../../model/wordleGame";
import EndScreen from "../endScreen/endScreen";
import { findOptimalGuess, t } from "../../model/evaluateGuess";

interface WordleBoardProps {
    game: WordleGame;
}

class CouldNotMakeGuessError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "OutOfGuessesError";
    }
}

const WordleBoard: FC<WordleBoardProps> = (props) => {
    const [game, setGame] = useState(props.game);
    const [guesses, setGuesses] = useState([] as string[]);
    const [optimalGuesses, setOptimalGuesses] = useState([] as string[]);
    const [isOver, setIsOver] = useState(false);
    t();

    const GuessForm = () => {
        const [currGuess, setCurrGuess] = useState("");

        const makeGuess = () => {
            const lowerGuess: string = currGuess.toLowerCase();
            const isDone: boolean = game.makeGuess(lowerGuess);
            setGuesses(game.getGuesses());
            setCurrGuess("");
            const wordsRemaining = game.getWordsRemaining();
            setOptimalGuesses([...optimalGuesses, findOptimalGuess(wordsRemaining)]);

            if (isDone) {
                setIsOver(true);
            }
        };

        const guessInput = (
            <input
                className="guess-input"
                maxLength={5}
                autoFocus={!isOver}
                value={currGuess}
                onInput={(event) => {
                    const target = event.target as HTMLInputElement;
                    setCurrGuess(target.value);
                }}
                onBlur={({ target }) => target.focus()} // forcefully lock target
            ></input>
        );

        return (
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    try {
                        makeGuess();
                    } catch (err) {
                        alert((err as CouldNotMakeGuessError).message);
                    }
                }}
            >
                {guessInput}
            </form>
        );
    };

    const drawBoard = (): JSX.Element => {
        const rows = [];
        const guessMatches = game.getGuessMatches();
        for (let i = 0; i < guesses.length; i++) {
            const guess: string = guesses[i];
            const matches: MatchDegrees[] = guessMatches[i];
            rows.push(drawRow(guess, matches));
        }

        return <div className="board-inner">{rows}</div>;
    };

    const drawRow = (guess: string, matches: MatchDegrees[]): JSX.Element => {
        const chars: string[] = guess.split("");
        const letters = [];
        for (let i = 0; i < chars.length; i++) {
            letters.push(drawChar(chars[i], matches[i]));
        }

        return <div className="row">{letters}</div>;
    };

    const drawChar = (char: string, match: MatchDegrees): JSX.Element => {
        const matchClassMap: Record<MatchDegrees, string> = {
            [MatchDegrees.Exact]: "exact",
            [MatchDegrees.InWord]: "in-word",
            [MatchDegrees.NotInWord]: "not-in-word",
        };

        const matchClassName = matchClassMap[match];
        return (
            <div className={`${matchClassName} char`}>
                <p>{char}</p>
            </div>
        );
    };

    return isOver ? (
        <EndScreen
            message={`the word was: ${game.getWord().toUpperCase()}.`}
            buttonText={"play again"}
            optimalGuesses={optimalGuesses}
            guessEvaluations={game.getGuessEvaluations()}
            onClick={(event) => {
                setIsOver(false);
                setGame(new WordleGame(6));
                setOptimalGuesses([] as string[]);
                setGuesses([] as string[]);
                setIsOver(false);
            }}
        />
    ) : (
        <div className="board">
            <GuessForm />
            {drawBoard()}
        </div>
    );
};

export default WordleBoard;
