import { FC } from "react";

interface EndScreenProps {
    message: String,
    buttonText: String
    onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const EndScreen: FC<EndScreenProps> = (props) => {    
    return (
        <div className="end-screen">
            <p>{props.message}</p>
            <button onClick={props.onClick}>{props.buttonText}</button>
        </div>
    )
}

export default EndScreen;