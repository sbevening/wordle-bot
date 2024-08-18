import "./evaluation.css";
import "react-circular-progressbar/dist/styles.css";

import { FC } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GuessEvaluation } from "../../model/evaluateGuess";

const GOOD_SCORE_COLOR: string = "#1B998B";
const OK_SCORE_COLOR: string = "#CCC500";

interface EvaluationProps {
    evaluation: GuessEvaluation;
    optimalGuess: string
}

const buildProgressBarStyles = (value: number) => buildStyles({
    pathColor: (value < 90) ? OK_SCORE_COLOR : GOOD_SCORE_COLOR,
    textColor: (value < 90) ? OK_SCORE_COLOR : GOOD_SCORE_COLOR,
    trailColor: "#2E4C4D",
});

export const Evaluation: FC<EvaluationProps> = (props) => {
    const eliminationScore = decimalToPercent(props.evaluation.elimination);
    const frequencyScore = decimalToPercent(props.evaluation.frequencies);
    const matchScore = decimalToPercent(props.evaluation.matches);

    return (
        <div className="outer">
            <p className="guess">{props.evaluation.guess}</p>
            {buildProgressBar("word elimination", eliminationScore)}
            {buildProgressBar("letter frequency", frequencyScore)}
            {buildProgressBar("letter matches", matchScore)}
            <p className="guess">{props.optimalGuess}</p>
        </div>
    );
};

const buildProgressBar = (label: string, value: number) => {
    return (
        <div className="progress-bar-container-outer">
            <p>{label}</p>
            <div className="progress-bar-container-inner">
                <CircularProgressbar
                    className="progress-bar"
                    value={value}
                    text={`${value}%`}
                    styles={buildProgressBarStyles(value)}
                />
            </div>
        </div>
    );
};

const decimalToPercent = (x: number) => {
    return Math.floor(x * 100);
};
