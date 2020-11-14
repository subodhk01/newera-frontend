import React from 'react'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import TestHeader from '../../components/UI/TestHeader'
import { BiTimeFive } from 'react-icons/bi'
import Options from '../../components/Test/Options'
import { PRIMARY_DARK } from '../../utils/Colors'

// import dynamic from 'next/dynamic'

// const axiosInstance = dynamic(() =>
//   import('../../utils/axios').then((mod) => mod.axiosInstance),
//   {ssr: false}
// )

function createMarkup(data) {
    return {__html: data};
}

const BLANK_QUESTION = {
    image: "",
    type: "",
    section: 0,
    correctMarks: 4,
    incorrectMarks: 0,
    partialMarks: 0,
}

const BLANK_ANSWER = {
    answer: "",
    topic: "",
    solution: ""
}

export default function Test(props){  
    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ questions, setQuestions ] = React.useState([BLANK_QUESTION])
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ answers, setAnswers ] = React.useState([BLANK_ANSWER])
    const [ render, setRender ] = React.useState(0)

    React.useEffect(() => {
        setLoading(false)
    }, [])

    const handleCurrentQuestion = (index) => {
        setCurrentQuestion(index)
    }

    const handleSingleCorrect = (answer) => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            newAnswers[currentQuestion].answer = answer 
            newAnswers[currentQuestion].answered = true
        }
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleMultipleCorrect = (answer) => {
        let newAnswers = answers
        if(newAnswers[currentQuestion].answer.includes(answer)){
            newAnswers[currentQuestion].answer = newAnswers[currentQuestion].answer.replace(answer, "")
        }else{
            newAnswers[currentQuestion].answer += answer
        }
        newAnswers[currentQuestion].answer = newAnswers[currentQuestion].answer.split("").sort().join("")
        console.log("new answer: ", typeof(newAnswers[currentQuestion].answer), newAnswers[currentQuestion].answer)
        newAnswers[currentQuestion].answered = true
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }
    
    const handleClear = () => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            newAnswers[currentQuestion].answer = ""
            newAnswers[currentQuestion].answered = false
        }
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleMark = () => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            newAnswers[currentQuestion].marked = true
        }
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleNewQuestion = () => {
        setAnswers([...answers, BLANK_ANSWER])
        setQuestions([...questions, BLANK_QUESTION])
    }

    return(
        <>
            { loading ?
                <div>
                    Loading...
                </div>
                :
                <>
                    <div>
                        <TestHeader testName="Custom Test 1" />
                        <div className="d-flex align-items-center p-2 border-bottom">
                            <div className="circle border-green m-2">
                                {questions[currentQuestion].correctMarks}
                            </div>
                            <div className="circle border-red m-2">
                                {questions[currentQuestion].incorrectMarks}
                            </div>
                            <div className="btn btn-secondary m-2">
                                {questions[currentQuestion].type == 0 && "Single Correct"}
                                {questions[currentQuestion].type == 1 && "Multiple Correct"}
                                {questions[currentQuestion].type == 2 && "Integer Type"}
                                {questions[currentQuestion].type == 3 && "Matrix"}
                            </div>
                            <div className="m-2 d-flex align-items-center">
                                <BiTimeFive className="m-1" size="30" color="grey" />
                                <span className="font-12">Time</span>
                            </div>
                            <div className="btn btn-danger m-2">
                                End Test
                            </div>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-3 border-right px-2 py-4">
                            <div className="d-flex flex-wrap justify-content-center">
                                {answers.map((question, index) =>
                                    <div 
                                        key={index} 
                                        className={`m-2 item-shadow circle-big 
                                            ${index === currentQuestion && "active"}
                                            ${answers[index].marked && answers[index].answered && "answered-marked"} 
                                            ${answers[index].marked && !answers[index].answered && "unanswered-marked"} 
                                            ${!answers[index].marked && answers[index].answered && "answered"} 
                                            ${!answers[index].marked && !answers[index].answered && answers[index].visited && "unanswered"} 
                                        `} 
                                        onClick={() => handleCurrentQuestion(index)}>
                                        {index + 1}
                                    </div>
                                )}
                                <div className={`m-2 item-shadow circle-big `} onClick={() => handleNewQuestion()}>
                                    +
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9">
                            {questionLoading ?
                                <div>
                                    Loading
                                </div> :
                                <>
                                    <div className="d-flex align-items-center p-2">
                                        <div className="mt-bold font-13 m-2">
                                            Q. {currentQuestion + 1}
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div dangerouslySetInnerHTML={createMarkup(questions[currentQuestion].text)}></div>
                                        </div>
                                        <div>
                                            <Options 
                                                currentQuestion={currentQuestion} 
                                                question={questions[currentQuestion]} 
                                                response={answers}
                                                handleSingleCorrect={handleSingleCorrect}
                                                handleMultipleCorrect={handleMultipleCorrect}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="btn btn-secondary" onClick={handleClear}>
                                                Clear response
                                            </div>
                                            <div className="btn btn-info" onClick={handleMark}>
                                                Review Later
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <style jsx>{`
                        .circle {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 40px;
                            width: 40px;
                            border-radius: 50%;
                            font-size: 1.1rem;
                            color: rgba(0,0,0,0.7);
                        }
                        .circle-big {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 60px;
                            width: 60px;
                            border-radius: 50%;
                            font-size: 1.1rem;
                            color: rgba(0,0,0,0.7);
                            cursor: pointer;
                            transition: 0.3s;
                        }
                        .active {
                            box-shadow: 0px 0px 10px 7px silver;
                            transform: scale(1.1);
                        }
                        .unattempted {
                            background-color: rgba(0,0,0,0.1);
                        }
                        .unanswered {
                            background-color: red;
                            color: white;
                        }
                        .answered {
                            background-color: green;
                            color: white;
                        }
                        .unanswered-marked {
                            background-color: blue;
                            color: white;
                        }
                        .answered-marked {
                            background-color: purple;
                            color: white;
                        }
                    `}</style>
                </>
            }
        </>
    )
}