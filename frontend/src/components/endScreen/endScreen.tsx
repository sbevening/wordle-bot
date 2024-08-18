import "./endScreen.css";

import { FC } from "react";
import { GuessEvaluation } from "../../model/evaluateGuess";
import { Evaluation } from "../evaluation/evaluation";

interface EndScreenProps {
    message: String;
    buttonText: String;
    guessEvaluations: GuessEvaluation[];
    optimalGuesses: string[];
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const EndScreen: FC<EndScreenProps> = (props) => {
    return (
        <div className="end-screen">
            <p>{props.message}</p>
            <div className="evaluations">
                {props.guessEvaluations.map((e, i) => (
                    <Evaluation
                        evaluation={e}
                        optimalGuess={props.optimalGuesses[i]}
                    />
                ))}
            </div>
            <button className="play-again" onClick={props.onClick}>
                {props.buttonText}
            </button>
        </div>
    );
};

export default EndScreen;
