import React from 'react'
import { PRIMARY } from "../../utils/Colors";

export default function Options(props) {
    const [ render, setRender ] = React.useState(0)
    const middleSingleCorrect = (answer) => {
        props.handleSingleCorrect(answer)
        setRender((render + 1) % 100)
    }
    const middleMultipleCorrect = (answer) => {
        props.handleMultipleCorrect(answer)
        setRender((render + 1) % 100)
    }
    return (
        <>
            <div>
                {props.question && props.response && props.question.type === 0 && 
                    <div className="d-flex flex-wrap align-items-center">
                        <div onClick={() => middleSingleCorrect(0)} className={`single-correct ${props.response[props.currentQuestion].answer === 0 && `selected`}`}>
                            A
                        </div>
                        <div onClick={() => middleSingleCorrect(1)} className={`single-correct ${props.response[props.currentQuestion].answer === 1 && `selected`}`}>
                            B
                        </div>
                        <div onClick={() => middleSingleCorrect(2)} className={`single-correct ${props.response[props.currentQuestion].answer === 2 && `selected`}`}>
                            C
                        </div>
                        <div onClick={() => middleSingleCorrect(3)} className={`single-correct ${props.response[props.currentQuestion].answer === 3 && `selected`}`}>
                            D
                        </div>
                    </div>
                }
                {props.question && props.response && props.question.type === 1 && 
                    <div className="d-flex flex-wrap align-items-center">
                        <div onClick={() => middleMultipleCorrect(0)} className={`single-correct ${props.response[props.currentQuestion].answer.includes(0) && `selected`}`}>
                            A
                        </div>
                        <div onClick={() => middleMultipleCorrect(1)} className={`single-correct ${props.response[props.currentQuestion].answer.includes(1)  && `selected`}`}>
                            B
                        </div>
                        <div onClick={() => middleMultipleCorrect(2)} className={`single-correct ${props.response[props.currentQuestion].answer.includes(2) && `selected`}`}>
                            C
                        </div>
                        <div onClick={() => middleMultipleCorrect(3)} className={`single-correct ${props.response[props.currentQuestion].answer.includes(3) && `selected`}`}>
                            D
                        </div>
                    </div>
                }
            </div>
            <style jsx>{`
                .single-correct {
                    border: 1px solid ${PRIMARY};
                    padding: 0.7rem 2.3rem;
                    margin: 1rem;
                    font-family: madetommy-bold;
                    font-size: 1.2rem;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .single-correct:hover {
                    background-color: ${PRIMARY};
                    color: white;
                }
                .selected {
                    background-color: ${PRIMARY};
                    color: white;
                }
            `}</style>
        </>
    )
}