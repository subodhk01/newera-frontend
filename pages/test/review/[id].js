import React from 'react'
import { axiosInstance } from '../../../utils/axios'
import { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'
import { RiTimerFill } from 'react-icons/ri'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Options from '../../../components/Test/Options'
import { PRIMARY_DARK } from '../../../utils/Colors'
import { customStyles, customStyles2 } from '../../../utils/constants'
import { Alert } from 'antd'
import Modal from 'react-modal';
import { fancyTimeFormat, arrayRemove, fancyToNormalTimeFormat, numberToAlphabet, arrayToAlphabet } from '../../../utils/functions'
import Link from 'next/link'
//Modal.setAppElement('#app');
// import dynamic from 'next/dynamic'

// const axiosInstance = dynamic(() =>
//   import('../../utils/axios').then((mod) => mod.axiosInstance),
//   {ssr: false}
// )

function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const router = useRouter()
    const { id } = router.query

    const [ session, setSession ] = React.useState()
    const [ loading, setLoading ] = React.useState(true)
    const [ ending, setEnding ] = React.useState(false)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ result, setResult ] = React.useState()
    const [ test, setTest ] = React.useState()
    const [ localSections, setLocalSections ] = React.useState()
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ response, setResponse ] = React.useState()
    const [ solutionModal, setSolutionModal ] = React.useState(false)
    const [ render, setRender ] = React.useState(0)

    const handleCurrentQuestion = (index) => {
        setCurrentQuestion(index)
    }

    React.useEffect(() => {
        if(id){
            props.setHeader(false)
            axiosInstance.get(`results/${id}/`).then((response) => {
                console.log("result response: ", response.data)
                let test = response.data && response.data.test
                let localSections = {}
                for(let count in test.questions){
                    if( !localSections[test.questions[count].section] && localSections[test.questions[count].section] != 0 ){
                        localSections[test.questions[count].section] = parseInt(count)
                    }
                }
                console.log(localSections)
                setLocalSections(localSections)
                setResult(response.data)
                setTest(response.data && response.data.test)
                setResponse(response.data && response.data.response)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [id])

    return(
        <>
            { loading ?
                <div>
                    Loading...
                </div>
                :
                <>
                    <div>
                        <Modal
                            isOpen={solutionModal}
                            onRequestClose={() => setSolutionModal(false)}
                            style={customStyles2}
                            contentLabel="Example Modal"
                            ariaHideApp={false}
                        >
                            <div className="text-center">
                                <h5 className="mb-3">
                                    Solution
                                </h5>
                                <div>
                                    <span>{test.questions[currentQuestion].solutionText}</span>
                                </div>
                                <div>
                                    <img src={test.questions[currentQuestion].solution} style={{maxWidth: "60vw", maxHeight: "60vh"}} />
                                </div>
                                <div>
                                    {test.questions[currentQuestion].video_solution && <span>Video Solution: {test.questions[currentQuestion].video_solution}</span> }
                                </div>
                                <div className="text-right">
                                    <div className="btn btn-warning" onClick={() => setSolutionModal(false)}>
                                        Close
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <TestHeader testName={test.name} />
                        <div className="d-flex align-items-center flex-wrap p-2 border-bottom">
                            <div className="circle border-green m-2">
                                {test.questions[currentQuestion].correctMarks}
                            </div>
                            <div className="circle border-red m-2">
                                {test.questions[currentQuestion].incorrectMarks}
                            </div>
                            <button className="btn btn-hollow m-2" disabled>
                                {test.questions[currentQuestion].type == 0 && "Single Correct"}
                                {test.questions[currentQuestion].type == 1 && "Multiple Correct"}
                                {test.questions[currentQuestion].type == 2 && "Integer Type"}
                                {test.questions[currentQuestion].type == 3 && "Matrix"}
                            </button>
                            <button className="btn btn-hollow d-flex align-items-center justify-content-center" style={{minWidth: "300px"}} disabled>
                                <RiTimerFill className="m-1" size="17" color="grey" />
                                <span className="font-1">Time spent on this question: {fancyToNormalTimeFormat(response[currentQuestion].time)}</span>
                            </button>
                            <Link href={'/tests'}>
                                <a>
                                    <div className="btn btn-danger m-2">
                                        End Review
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-9 p-3">
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
                                            <div dangerouslySetInnerHTML={createMarkup(test.questions[currentQuestion].text)}></div>
                                            <img src={test.questions[currentQuestion].image} className="mx-auto" style={{maxWidth: "80%"}} />
                                        </div>
                                        <div>
                                            Topic: {test.questions[currentQuestion].topic}
                                        </div>
                                        <div className="font-12 mt-bold">
                                            {result.result.question_wise_marks[currentQuestion].status === 0 && <div className="text-muted">Unattempted</div>}
                                            {result.result.question_wise_marks[currentQuestion].status === 1 && <div className="text-danger">Incorrect</div>}
                                            {result.result.question_wise_marks[currentQuestion].status === 2 && <div className="text-success">Correct</div>}
                                            {result.result.question_wise_marks[currentQuestion].status === 3 && <div className="text-info">Partially Correct</div>}
                                        </div>
                                        <div className="font-12 mt-bold">
                                            Correct Answer:{' '}
                                                {typeof(test.answers[currentQuestion].answer) === 'object' && test.answers[currentQuestion].answer.length === 1 && typeof(test.answers[currentQuestion].answer[0]) === 'number' && numberToAlphabet(test.answers[currentQuestion].answer[0])}
                                                {typeof(test.answers[currentQuestion].answer) === 'object' && test.answers[currentQuestion].answer.length > 1 && typeof(test.answers[currentQuestion].answer[0]) === 'number' &&  arrayToAlphabet(test.answers[currentQuestion].answer)}
                                                {typeof(test.answers[currentQuestion].answer) != 'object' && test.answers[currentQuestion].answer}
                                                {typeof(test.answers[currentQuestion].answer) === 'object' && typeof(test.answers[currentQuestion].answer[0]) === 'object' && `${arrayToAlphabet(test.answers[currentQuestion].answer[0])}, ${arrayToAlphabet(test.answers[currentQuestion].answer[1])}, ${arrayToAlphabet(test.answers[currentQuestion].answer[2])}, ${arrayToAlphabet(test.answers[currentQuestion].answer[3])}`}
                                        </div>
                                        <div>
                                            { test.questions[currentQuestion].solution && <div className="btn btn-info" onClick={() => setSolutionModal(true)}>See Solution</div> }
                                        </div>
                                        <div>
                                            <Options 
                                                readOnly
                                                currentQuestion={currentQuestion} 
                                                question={test.questions[currentQuestion]} 
                                                response={response}
                                                answers={test.answers}
                                                setResponse={setResponse}
                                                // handleSingleCorrect={handleSingleCorrect}
                                                // handleMultipleCorrect={handleMultipleCorrect}
                                                // handleNumericalCorrect={handleNumericalCorrect}
                                                // handleMatrixCorrect={handleMatrixCorrect}
                                            />
                                        </div>
                                        {/* <div className="d-flex align-items-center">
                                            <div className="btn btn-secondary" onClick={handleClear}>
                                                Clear response
                                            </div>
                                            <div className="btn btn-info" onClick={handleMark}>
                                                Review Later
                                            </div>
                                        </div> */}
                                    </div>
                                </>
                            }
                            <div>
                                {/* <div className="btn btn-danger" onClick={() => setTestEndModal(true)}>
                                    Submit Test
                                </div> */}
                            </div>
                        </div>
                        <div className="col-12 col-lg-3 position-relative border-left py-4 questions-container">
                            <div>
                                <div className="d-flex flex-wrap justify-content-center mb-1">
                                    {test && test.sections && test.sections.length ? test.sections.map((section, index) =>
                                        <div className="d-flex" key={`section-${index}`}>
                                            <div className={`font-09 mr-0 btn d-flex align-items-center ${test.questions[currentQuestion].section === section ? 'btn-warning' : 'btn-hollow text-muted'}`} key={`section-${index}`} onClick={() => handleCurrentQuestion(localSections[section])}>
                                                {section}
                                            </div>
                                            {/* <div className="btn ml-0 btn-danger py-0 px-2 d-flex align-items-center btn-right" onClick={() => handleSectionRemove(section)} style={{right: "5px", top: "3px"}}><IoIosCloseCircle size="24" /></div> */}
                                        </div>
                                    )
                                    :
                                        <Alert description="No sections" />
                                    }
                                </div>
                            </div>
                            <div className="np-container w-100 p-3">
                                <div className="row no-gutters text-center">
                                    <div className="col-6 p-2">
                                        <button className="btn btn-warning w-75" onClick={() => handleCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0}>
                                            <BsArrowLeft color="white" size="30" />
                                        </button>
                                    </div>
                                    <div className="col-6 p-2">
                                        <button className="btn btn-warning w-75" onClick={() => handleCurrentQuestion(currentQuestion + 1)} disabled={currentQuestion === response.length - 1}>
                                            <BsArrowRight color="white" size="30" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap justify-content-center">
                                {response.map((question, index) =>
                                    <div 
                                        key={index} 
                                        className={`m-2 item-shadow circle-big 
                                            ${index === currentQuestion && "active"}
                                            ${result.result.question_wise_marks[index].status < 2 && "incorrect"} 
                                            ${result.result.question_wise_marks[index].status === 2 && "correct"} 
                                            ${typeof(result.result.question_wise_marks[index].status) === "object" && result.result.question_wise_marks[index].status.includes(2) && "correct"} 
                                            ${typeof(result.result.question_wise_marks[index].status) === "object" && result.result.question_wise_marks[index].status.includes(3) && "partially-correct"} 
                                        `} 
                                        onClick={() => handleCurrentQuestion(index)}>
                                        {index + 1}
                                    </div>
                                )}
                            </div>
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
                            background-color: #d2d2d2;
                        }
                        .incorrect {
                            background-color: #ec605f;
                            color: white;
                        }
                        .partially-correct {
                            background-color: #17a2b8;
                        }
                        .correct {
                            background-color: #25ba99;
                            color: white;
                        }
                        @media(min-width: 768px){
                            .questions-container {
                                min-height: calc(100vh - 133px);
                            }
                        }
                    `}</style>
                </>
            }
        </>
    )
}