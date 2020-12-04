import React from 'react'
import { axiosInstance } from '../../../utils/axios'
import { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'
import { RiTimerFill } from 'react-icons/ri'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Options from '../../../components/Test/Options'
import { PRIMARY_DARK } from '../../../utils/Colors'
import Modal from 'react-modal';
import { fancyTimeFormat, arrayRemove } from '../../../utils/functions'
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
const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    content: {
        borderRadius: "10px",
        background: "white",
        boxShadow: "0px 0px 30px 6px #ecf0f7",
        border: "none"
    }
};
const customStyles2 = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        position: 'absolute',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: "10px",
        background: "white",
        boxShadow: "0px 0px 30px 6px #ecf0f7",
        border: "none"
    }
};

export default function Test(props){  
    const router = useRouter()
    const { id } = router.query

    const [ session, setSession ] = React.useState()
    const [ loading, setLoading ] = React.useState(true)
    const [ ending, setEnding ] = React.useState(false)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ result, setResult ] = React.useState()
    const [ test, setTest ] = React.useState()
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ response, setResponse ] = React.useState()
    const [ render, setRender ] = React.useState(0)

    const handleCurrentQuestion = (index) => {
        let newResponse = response
        setResponse(newResponse)
        setCurrentQuestion(index)
    }

    React.useEffect(() => {
        if(id){
            console.log(id)
            axiosInstance.get(`results/${id}/`).then((response) => {
                console.log("result response: ", response.data)
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
                        <TestHeader testName={test.name} />
                        <div className="d-flex align-items-center p-2 border-bottom">
                            <div className="circle border-green m-2">
                                {test.questions[currentQuestion].correctMarks}
                            </div>
                            <div className="circle border-red m-2">
                                {test.questions[currentQuestion].incorrectMarks}
                            </div>
                            <div className="btn btn-secondary m-2">
                                {test.questions[currentQuestion].type == 0 && "Single Correct"}
                                {test.questions[currentQuestion].type == 1 && "Multiple Correct"}
                                {test.questions[currentQuestion].type == 2 && "Integer Type"}
                                {test.questions[currentQuestion].type == 3 && "Matrix"}
                            </div>
                            <button className="btn btn-hollow d-flex align-items-center justify-content-center" style={{minWidth: "300px"}} disabled>
                                <RiTimerFill className="m-1" size="17" color="grey" />
                                <span className="font-1">Time spent on this question: </span>
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
                                            {/* <div dangerouslySetInnerHTML={createMarkup(test.questions[currentQuestion].text)}></div> */}
                                            <img src={test.questions[currentQuestion].image} />
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
                            <div className="d-flex flex-wrap justify-content-center">
                                {response.map((question, index) =>
                                    <div 
                                        key={index} 
                                        className={`m-2 item-shadow circle-big 
                                            ${index === currentQuestion && "active"}
                                            ${response[index].marked && response[index].answered && "answered-marked"} 
                                            ${response[index].marked && !response[index].answered && "unanswered-marked"} 
                                            ${!response[index].marked && response[index].answered && "answered"} 
                                            ${!response[index].marked && !response[index].answered && response[index].visited && "unanswered"} 
                                        `} 
                                        onClick={() => handleCurrentQuestion(index)}>
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                            <div className="np-container position-absolute w-100 p-3">
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