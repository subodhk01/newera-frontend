import React from 'react'
import { PRIMARY } from "../../utils/Colors";

export default function Options(props) {
    const [ render, setRender ] = React.useState(0)
    const checkReadOnly = () => props.readOnly
    const middleSingleCorrect = (answer) => {
        if(checkReadOnly()) return
        props.handleSingleCorrect(answer)
        setRender((render + 1) % 100)
    }
    const middleMultipleCorrect = (answer) => {
        if(checkReadOnly()) return
        props.handleMultipleCorrect(answer)
        setRender((render + 1) % 100)
    }
    const middleNumericalCorrect = (answer) => {
        if(checkReadOnly()) return
        props.handleNumericalCorrect(answer)
        setRender((render + 1) % 100)
    }
    const middleMatrixCorrect = (answer, index) => {
        if(checkReadOnly()) return
        props.handleMatrixCorrect(answer, index)
        setRender((render + 1) % 100)
    }
    return (
        <>
            <div>
                {props.question && props.response && props.question.type === 0 && 
                    <div className="">
                        <div className="d-flex align-items-center">
                            <div onClick={() => middleSingleCorrect([0])} className={`option single-correct ${props.response[props.currentQuestion].answer.includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(0) && `correct-answer`}`}>
                                A
                            </div>
                            {props.handleOptionText ?
                                <input className="optionText form-control" value={props.question.option1text} onChange={(event) => props.handleOptionText(1,event.target.value)} placeholder="Option A Text" />
                                :
                                <div>{props.question.option1text}</div>
                            }
                            </div>
                        <div className="d-flex align-items-center">
                            <div onClick={() => middleSingleCorrect([1])} className={`option single-correct ${props.response[props.currentQuestion].answer.includes(1) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(1) && `correct-answer`}`}>
                                B
                            </div>
                            {props.handleOptionText ?
                                <input className="optionText form-control" value={props.question.option2text} onChange={(event) => props.handleOptionText(2,event.target.value)} placeholder="Option B Text" />
                                :
                                <div>{props.question.option2text}</div>
                            }
                        </div>
                        <div className="d-flex align-items-center">
                            <div onClick={() => middleSingleCorrect([2])} className={`option single-correct ${props.response[props.currentQuestion].answer.includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(2) && `correct-answer`}`}>
                                C
                            </div>
                            {props.handleOptionText ?
                                <input className="optionText form-control" value={props.question.option3text} onChange={(event) => props.handleOptionText(3,event.target.value)} placeholder="Option C Text" />
                                :
                                <div>{props.question.option3text}</div>
                            }
                        </div>
                        <div className="d-flex align-items-center">
                            <div onClick={() => middleSingleCorrect([3])} className={`option single-correct ${props.response[props.currentQuestion].answer.includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(3) && `correct-answer`}`}>
                                D
                            </div>
                            {props.handleOptionText ?
                                <input className="optionText form-control" value={props.question.option4text} onChange={(event) => props.handleOptionText(4,event.target.value)} placeholder="Option D Text" />
                                :
                                <div>{props.question.option4text}</div>
                            }
                        </div>
                    </div>
                }
                {props.question && props.response && props.question.type === 1 && 
                    <div className="d-flex flex-wrap align-items-center">
                        <div onClick={() => middleMultipleCorrect(0)} className={`option ${props.response[props.currentQuestion].answer.includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(0) && `correct-answer`}`}>
                            A
                        </div>
                        <div onClick={() => middleMultipleCorrect(1)} className={`option ${props.response[props.currentQuestion].answer.includes(1)  && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(1) && `correct-answer`}`}>
                            B
                        </div>
                        <div onClick={() => middleMultipleCorrect(2)} className={`option ${props.response[props.currentQuestion].answer.includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(2) && `correct-answer`}`}>
                            C
                        </div>
                        <div onClick={() => middleMultipleCorrect(3)} className={`option ${props.response[props.currentQuestion].answer.includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer.includes(3) && `correct-answer`}`}>
                            D
                        </div>
                    </div>
                }
                {props.question && props.response && props.question.type === 2 && 
                    <div className="form-group mx-auto w-75">
                        {props.readOnly && <label className="mt-3">Your Answer</label>}
                        <input onChange={(event) => middleNumericalCorrect(event.target.value)} value={props.response[props.currentQuestion].answer} className="form-control" placeholder="Answer" type={"number"} disabled={props.readOnly} />
                        {props.readOnly &&
                            <>
                                <label className="mt-3">Correct Answer</label>
                                <input value={props.answers && props.answers[props.currentQuestion].answer} className="form-control" placeholder="Answer" type={"number"} disabled={props.readOnly} />
                            </>
                        }
                    </div>
                }
                {props.question && props.response && props.question.type === 3 && 
                    <>
                        <div className="d-flex flex-wrap align-items-center">
                            <div onClick={() => middleMatrixCorrect(0, 0)} className={`option ${props.response[props.currentQuestion].answer[0].includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[0].includes(0) && `correct-answer`}`}>
                                A
                            </div>
                            <div onClick={() => middleMatrixCorrect(1, 0)} className={`option ${props.response[props.currentQuestion].answer[0].includes(1)  && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[0].includes(1) && `correct-answer`}`}>
                                B
                            </div>
                            <div onClick={() => middleMatrixCorrect(2, 0)} className={`option ${props.response[props.currentQuestion].answer[0].includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[0].includes(2) && `correct-answer`}`}>
                                C
                            </div>
                            <div onClick={() => middleMatrixCorrect(3, 0)} className={`option ${props.response[props.currentQuestion].answer[0].includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[0].includes(3) && `correct-answer`}`}>
                                D
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            <div onClick={() => middleMatrixCorrect(0, 1)} className={`option ${props.response[props.currentQuestion].answer[1].includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[1].includes(0) && `correct-answer`}`}>
                                A
                            </div>
                            <div onClick={() => middleMatrixCorrect(1, 1)} className={`option ${props.response[props.currentQuestion].answer[1].includes(1)  && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[1].includes(1) && `correct-answer`}`}>
                                B
                            </div>
                            <div onClick={() => middleMatrixCorrect(2, 1)} className={`option ${props.response[props.currentQuestion].answer[1].includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[1].includes(2) && `correct-answer`}`}>
                                C
                            </div>
                            <div onClick={() => middleMatrixCorrect(3, 1)} className={`option ${props.response[props.currentQuestion].answer[1].includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[1].includes(3) && `correct-answer`}`}>
                                D
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            <div onClick={() => middleMatrixCorrect(0, 2)} className={`option ${props.response[props.currentQuestion].answer[2].includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[2].includes(0) && `correct-answer`}`}>
                                A
                            </div>
                            <div onClick={() => middleMatrixCorrect(1, 2)} className={`option ${props.response[props.currentQuestion].answer[2].includes(1)  && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[2].includes(1) && `correct-answer`}`}>
                                B
                            </div>
                            <div onClick={() => middleMatrixCorrect(2, 2)} className={`option ${props.response[props.currentQuestion].answer[2].includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[2].includes(2) && `correct-answer`}`}>
                                C
                            </div>
                            <div onClick={() => middleMatrixCorrect(3, 2)} className={`option ${props.response[props.currentQuestion].answer[2].includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[2].includes(3) && `correct-answer`}`}>
                                D
                            </div>
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            <div onClick={() => middleMatrixCorrect(0, 3)} className={`option ${props.response[props.currentQuestion].answer[3].includes(0) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[3].includes(0) && `correct-answer`}`}>
                                A
                            </div>
                            <div onClick={() => middleMatrixCorrect(1, 3)} className={`option ${props.response[props.currentQuestion].answer[3].includes(1)  && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[3].includes(1) && `correct-answer`}`}>
                                B
                            </div>
                            <div onClick={() => middleMatrixCorrect(2, 3)} className={`option ${props.response[props.currentQuestion].answer[3].includes(2) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[3].includes(2) && `correct-answer`}`}>
                                C
                            </div>
                            <div onClick={() => middleMatrixCorrect(3, 3)} className={`option ${props.response[props.currentQuestion].answer[3].includes(3) && `selected`} ${props.answers && props.answers[props.currentQuestion].answer[3].includes(3) && `correct-answer`}`}>
                                D
                            </div>
                        </div>
                    </>
                }
            </div>
            <style jsx>{`
                .option {
                    border: 1px solid ${PRIMARY};
                    padding: 0.7rem 2.3rem;
                    margin: 1rem;
                    font-family: madetommy-bold;
                    font-size: 1.2rem;
                    border-radius: 5px;
                    ${!props.readOnly && `cursor: pointer;`}
                    transition: 0.3s;
                }
                .correct-answer {
                    border: 4px solid green;
                }
                // .option:hover {
                //     background-color: ${PRIMARY};
                //     color: white;
                // }
                .selected {
                    background-color: ${PRIMARY};
                    color: white;
                }
                .single-correct {
                    border-radius: 100px;
                    padding: 0px;
                    height: 50px;
                    width: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .optionText {
                    padding: 1.3rem 1.3rem;
                    width: 75%;
                    font-family: madetommy-regular;
                    font-size: 0.9rem;
                    color: rgba(0,0,0,0.8);
                }
            `}</style>
        </>
    )
}