import "./evaluation.css";
import "react-circular-progressbar/dist/styles.css";
import "tippy.js/dist/tippy.css"

import { FC, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GuessEvaluation } from "../../model/evaluateGuess";
import Tippy from "@tippyjs/react";

const GOOD_SCORE_COLOR: string = "#1B998B";
const OK_SCORE_COLOR: string = "#CCC500";

const ELIMINATION_DESCRIPTION = `
    A score from 0 to 100 based on how many possible guesses in the Wordle dictionary
    your guess eliminates. A score of 100 means that there is only 1 possible answe.
`;

const MATCH_DESCRIPTION = `
    A score from 0 to 100 based on how well your letters match up with the correct guess.
    Green matches are weighted more heavily than yellow matches. A score of 100 is only
    achieved on acorrect guess. 
`;

const FREQUENCY_DESCRIPTION = `
    A score from 0 to 100 based on how frequently each letter in your word appears in the
    set of possible Wordle words.
`;

interface EvaluationProps {
    evaluation: GuessEvaluation;
    optimalGuess: string;
}

const buildProgressBarStyles = (value: number) =>
    buildStyles({
        pathColor: value < 90 ? OK_SCORE_COLOR : GOOD_SCORE_COLOR,
        textColor: value < 90 ? OK_SCORE_COLOR : GOOD_SCORE_COLOR,
        trailColor: "#2E4C4D",
    });

export const Evaluation: FC<EvaluationProps> = (props) => {
    const eliminationScore = decimalToPercent(props.evaluation.elimination);
    const frequencyScore = decimalToPercent(props.evaluation.frequencies);
    const matchScore = decimalToPercent(props.evaluation.matches);

    return (
        <div className="outer">
            <span>
                <p className="guess">YOU: {props.evaluation.guess}</p>
                <p className="guess">BEST: {props.optimalGuess}</p>
            </span>
            <div className="inner">
                <ProgressBar
                    label="Elimination"
                    value={eliminationScore}
                    description={ELIMINATION_DESCRIPTION}
                />
                <ProgressBar
                    label="Frequency"
                    value={frequencyScore}
                    description={FREQUENCY_DESCRIPTION}
                />
                <ProgressBar
                    label="Matches"
                    value={matchScore}
                    description={MATCH_DESCRIPTION}
                />
            </div>
        </div>
    );
};

interface progressBarProps {
    label: string;
    value: number;
    description: string;
}

const ProgressBar = (props: progressBarProps) => {
    const progressBar = (
        <div className="progress-bar-container-outer">
            <p>{props.label}</p>
            <div className="progress-bar-container-inner">
                <CircularProgressbar
                    className="progress-bar"
                    value={props.value}
                    text={`${props.value}%`}
                    styles={buildProgressBarStyles(props.value)}
                />
            </div>
        </div>
    );

    return <Tippy content={props.description}>
        {progressBar}
    </Tippy>
};

const decimalToPercent = (x: number) => {
    return Math.floor(x * 100);
};
