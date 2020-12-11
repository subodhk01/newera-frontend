import React from 'react'
import { axiosInstance } from '../../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'
import { RiTimerFill } from 'react-icons/ri'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Options from '../../../components/Test/Options'
import { PRIMARY_DARK } from '../../../utils/Colors'
import Modal from 'react-modal'
import { fancyTimeFormat, arrayRemove } from '../../../utils/functions'
import { customStyles, customStyles2 } from '../../../utils/constants'
import { load } from 'react-cookies'
import { Alert } from 'antd'
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

    const [ error, setError ] = React.useState("")
    const [ testStartModal,setTestStartModal ] = React.useState(false)
    const [ testEndModal, setTestEndModal ] = React.useState(false)
    const [ session, setSession ] = React.useState()
    const [ loading, setLoading ] = React.useState(true)
    const [ ending, setEnding ] = React.useState(false)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ test, setTest ] = React.useState()
    const [ timeRemaining, setTimeRemaining ] = React.useState()
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ response, setResponse ] = React.useState([{answer: "", marked: false, visited: true, time: 0},])
    const [ render, setRender ] = React.useState(0)

    const handleCurrentQuestion = (index) => {
        let newResponse = response
        newResponse[index].visited = true
        setResponse(newResponse)
        setCurrentQuestion(index)
    }

    const handleSingleCorrect = (answer) => {
        let newResponse = response
        if(newResponse[currentQuestion]){
            newResponse[currentQuestion].answer = answer 
            newResponse[currentQuestion].answered = true
        }
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleMultipleCorrect = (answer) => {
        let newResponse = response
        if(newResponse[currentQuestion].answer.includes(answer)){
            newResponse[currentQuestion].answer = arrayRemove(newResponse[currentQuestion].answer, answer)
        }else{
            newResponse[currentQuestion].answer.push(answer)
        }
        newResponse[currentQuestion].answer = newResponse[currentQuestion].answer.sort()
        newResponse[currentQuestion].answered = true
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleNumericalCorrect = (answer) => {
        let newResponse = response
        newResponse[currentQuestion].answer = answer
        newResponse[currentQuestion].answered = true
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleMatrixCorrect = (answer, index) => {
        let newResponse = response
        if(newResponse[currentQuestion].answer[index].includes(answer)){
            newResponse[currentQuestion].answer[index] = arrayRemove(newResponse[currentQuestion].answer[index], answer)
        }else{
            newResponse[currentQuestion].answer[index].push(answer)
        }
        newResponse[currentQuestion].answer[index] = newResponse[currentQuestion].answer[index].sort()
        newResponse[currentQuestion].answered = true
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }
    
    const handleClear = () => {
        let newResponse = response
        if(newResponse[currentQuestion]){
            if(test.questions[currentQuestion].type === 0 || test.questions[currentQuestion].type === 1){
                newResponse[currentQuestion].answer = []
            }else if(test.questions[currentQuestion].type === 2){
                newResponse[currentQuestion].answer = ""
            }else{
                newResponse[currentQuestion].answer = [[],[],[],[]]
            }
            newResponse[currentQuestion].answered = false
        }
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleMark = () => {
        let newResponse = response
        if(newResponse[currentQuestion]){
            newResponse[currentQuestion].marked = true
        }
        setResponse(newResponse)
        setRender((render + 1) % 100) // a pseudo update
    }

    React.useEffect(() => {
        if(id){
            axiosInstance.get(`tests/${id}/`).then((response) => {
                console.log("response test: ", response.data)
                let rawTest = response.data
                setTest(response.data)
                let newResponse = []
                var count = 0
                while(newResponse.length < rawTest.questions.length){
                    if(rawTest.questions[count].type === 0 || rawTest.questions[count].type === 1){
                        newResponse.push({answer: [], marked: false, visited: false, time: 0})
                    }else if(rawTest.questions[count].type === 2){
                        newResponse.push({answer: "", marked: false, visited: false, time: 0})
                    }else{
                        newResponse.push({answer: [[],[],[],[]], marked: false, visited: false, time: 0})
                    }
                    count++
                }
                newResponse[currentQuestion].visited = true
                setResponse(newResponse)
                setTestStartModal(true)
            }).catch((error) => {
                console.log(error)
                setError("Unable to fetch test, try refreshing the page or try again later.")
            })
        }
    }, [id])

    React.useEffect(() => {
        var time = "", increase = ""
        if(!loading){
            time = setInterval(() => {
                setTimeRemaining(timeRemaining => {
                    return timeRemaining - 1
                })
            }, 1000)
            increase = setInterval(() => {
                setCurrentQuestion((currentQuestion) => {
                    setResponse((response) => {
                        let newResponse = response
                        newResponse[currentQuestion].time++
                        return newResponse
                    })
                    return currentQuestion
                })
                }, 1000)
        }
        return () => {
            if(time) clearInterval(time)
            if(increase) clearInterval(increase)
        }
    }, [loading])

    React.useEffect(() => {
        if(!loading){
            if(timeRemaining && timeRemaining <= 0){
                setTestEndModal(true)
                endTest()
            }
        }
    })

    const startTest = () => {
        setError("")
        axiosInstance.post(`tests/${id}/sessions/`)
            .then((response) => {
                console.log("session create response: ", response.data)
                setSession(response.data)
                let session = response.data
                var seconds = session.duration.split(":")[0]*3600 + session.duration.split(":")[1]*60 + session.duration.split(":")[2]*1
                var session_start = new Date(session.checkin_time)
                var time_remaining = Math.floor(((new Date()).getTime() - session_start.getTime())/1000)
                console.log("session start time: ", session_start)
                console.log("time remaining: ", seconds - time_remaining)
                setTimeRemaining(seconds - time_remaining)
                setTestStartModal(false)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
                if(error.response.status === 403 && error.response.data.detail === "You have already attempted the test. You can practice after the live test ends."){
                    setError(error.response.data.detail)
                }
            })
    }
    const endTest = () => {
        console.log("endTest")
        setEnding(true)
        let finalResponse = response
        finalResponse.map((response, index) => {
            console.log("-----")
            console.log(response.time, fancyTimeFormat(response.time))
            response.time = fancyTimeFormat(response.time)
            console.log(response.time)
        })
        console.log("final Response: ", finalResponse)
        axiosInstance.patch(`sessions/${session.id}/`, {
            response: response,
            completed: true
        }).then((response) => {
            console.log("session end response: ", response.data)
            Router.push(`/result/${session.id}`)
        }).catch((error) => {
            console.log(error)
        })
    }

    return(
        <>
            <Modal
                isOpen={testStartModal}
                onRequestClose={() => setTestStartModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
                //shouldCloseOnOverlayClick={false}
            >
                <div className="text-center">
                    <div className="mb-3">
                        Instructions of testName
                    </div>
                    <div className="btn btn-info" onClick={startTest}>
                        Start Test
                    </div>
                    {error && 
                        <Alert
                            className="mt-3"
                            message="Cannot Attempt Test"
                            description={error}
                            type="error"
                        />
                    }
                </div>
            </Modal>
            <Modal
                isOpen={testEndModal}
                onRequestClose={() => setTestEndModal(false)}
                style={customStyles2}
                contentLabel="Example Modal"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={false}
            >
                <div className="text-center">
                    {!ending ?
                        <div>
                            <div className="mb-3">
                                Confirm End Test
                            </div>
                            <div className="btn btn-info" onClick={endTest}>
                                End Test
                            </div>
                            <div className="btn btn-warning" onClick={() => setTestEndModal(false)}>
                                Cancel
                            </div>
                        </div>
                        :
                        <div>
                            Submitting Responses...
                        </div> 
                    }
                </div>
            </Modal>
            { loading ?
                <div>
                    Loading...
                    {error && 
                        <Alert
                            className="mt-3"
                            message="Cannot Attempt Test"
                            description={error}
                            type="error"
                        />
                    }
                </div>
                :
                <React.StrictMode>
                    <div>
                        <TestHeader testName="Custom Test 1" />
                        <div className="d-flex flex-wrap align-items-center p-2 border-bottom">
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
                            <div className="btn btn-danger m-2" onClick={() => setTestEndModal(true)}>
                                End Test
                            </div>
                            <button className="btn btn-hollow d-flex align-items-center justify-content-center" style={{minWidth: "300px"}} disabled>
                                <RiTimerFill className="m-1" size="17" color="grey" />
                                <span className="font-1">Time Remaining: {fancyTimeFormat(timeRemaining)}</span>
                            </button>
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
                                                currentQuestion={currentQuestion} 
                                                question={test.questions[currentQuestion]} 
                                                response={response}
                                                setResponse={setResponse}
                                                handleSingleCorrect={handleSingleCorrect}
                                                handleMultipleCorrect={handleMultipleCorrect}
                                                handleNumericalCorrect={handleNumericalCorrect}
                                                handleMatrixCorrect={handleMatrixCorrect}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center p-3">
                                            <div className="btn btn-success" onClick={() => handleCurrentQuestion(currentQuestion + 1)}>
                                                Save and Next
                                            </div>
                                            <div className="btn btn-info" onClick={handleMark}>
                                                Mark for Review
                                            </div>
                                            <div className="btn btn-secondary" onClick={handleClear}>
                                                Clear response
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="py-4 px-3">
                                <div className="btn btn-danger" onClick={() => setTestEndModal(true)}>
                                    Submit Test
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3 position-relative border-left pt-4 pb-10 questions-container">
                            <div className="d-flex flex-wrap justify-content-center">
                                {response.map((question, index) =>
                                    <div 
                                        key={index} 
                                        className={`m-2 item-shadow circle-big position-relative 
                                            ${index === currentQuestion && "active"}
                                            ${response[index].marked && response[index].answered && "answered-marked"} 
                                            ${response[index].marked && !response[index].answered && "unanswered-marked"} 
                                            ${!response[index].marked && response[index].answered && "answered"} 
                                            ${!response[index].marked && !response[index].answered && response[index].visited && "unanswered"} 
                                        `} 
                                        onClick={() => handleCurrentQuestion(index)}>
                                        {index + 1}
                                        {response[index].marked && response[index].answered && 
                                            <div className="position-absolute tick-box">
                                                <img src="/tick.png" />
                                            </div>
                                        } 
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
                            color: white;
                            cursor: pointer;
                            background-color: #d2d2d2;
                            transition: 0.3s;
                        }
                        .tick-box {
                            right: 0;
                            bottom: 0;
                        }
                        .tick-box img {
                            width: 20px;
                            border: 2px solid white;
                            border-radius: 50px;
                        }
                        .active {
                            box-shadow: 0px 0px 10px 7px silver;
                            transform: scale(1.1);
                        }
                        .unattempted {
                            background-color: #d2d2d2;
                        }
                        .unanswered {
                            background-color: #ec605f;
                            color: white;
                        }
                        .answered {
                            background-color: #25ba99;
                            color: white;
                        }
                        .unanswered-marked {
                            background-color: #585fb9;
                            color: white;
                        }
                        .answered-marked {
                            background-color: #585fb9;
                            color: white;
                        }
                        @media(min-width: 768px){
                            .questions-container {
                                min-height: calc(100vh - 133px);
                            }
                        }
                    `}</style>
                </React.StrictMode>
            }
        </>
    )
}