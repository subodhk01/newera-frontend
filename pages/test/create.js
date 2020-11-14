import React from 'react'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import TestHeader from '../../components/UI/TestHeader'
import { BiTimeFive } from 'react-icons/bi'
import Options from '../../components/Test/Options'
import { PRIMARY_DARK } from '../../utils/Colors'
import { Select } from 'antd';
const { Option } = Select;
import { FilePond, File, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

registerPlugin(FilePondPluginImagePreview)


function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ testName, setTestName ] = React.useState("")
    const [ aits, setAits ] = React.useState("")
    const [ free, setFree ] = React.useState("")
    const [ questions, setQuestions ] = React.useState([{
        image: "https://media.etests.co.in/media/public/2020-08-14_171553.045694.jpg",
        type: 0,
        section: 0,
        correctMarks: 4,
        incorrectMarks: 0,
        partialMarks: 0,
    }])
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ answers, setAnswers ] = React.useState([{
        answer: "",
        topic: "",
        solution: ""
    }])
    const [ files, setFiles ] = React.useState([])
    const [ render, setRender ] = React.useState(0)

    React.useEffect(() => {
        setLoading(false)
    }, [])
    React.useEffect(() => {
        console.log(files)
        if(files.length){
            console.log("strat")
            console.log(files[0].id)
            console.log(files[0].origin)
            console.log(files[0].relativePath)
            console.log(files[0].serverId)
            console.log(files[0].source)
            console.log(files[0].status)
            console.log(files[0].transferId)
            console.log("end")
        }
    }, [files])

    const handleCurrentQuestion = (index) => {
        setCurrentQuestion(index)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleSingleCorrect = (answer) => {
        let newAnswers = answers
        newAnswers[currentQuestion].answer = answer 
        newAnswers[currentQuestion].answered = true
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
        newAnswers[currentQuestion].answered = true
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }
    
    const handleClear = () => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            newAnswers[currentQuestion].answer = ""
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
        setAnswers([...answers, {
            answer: "",
            topic: "",
            solution: ""
        }])
        setQuestions([...questions, {
            image: "",
            type: 0,
            section: 0,
            correctMarks: 4,
            incorrectMarks: 0,
            partialMarks: 0,
        }])
    }

    const handleQuestionTypeChange = (value) => {
        let newQuestions = questions
        let newAnswers = answers
        newQuestions[currentQuestion].type = value
        newAnswers[currentQuestion].answer = ""
        newAnswers[currentQuestion].answered = false
        setQuestions(newQuestions)
        setAnswers(answers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleFileChange = (file) => {
        console.log("file: ", file)
        let newQuestions = questions
        newQuestions[currentQuestion].image = file
        console.log("new questions: ", newQuestions)
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleTestSave = () => {
        axiosInstance.post("/tests/", {
            name: testName,
            questions: questions,
            answers: answers
        })
        .then((response) => {
            console.log("test save response: ", response.data)
        }).catch((error) => {
            console.log(error)
        })
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
                            <Select defaultValue={0} style={{ width: 220 }} onChange={handleQuestionTypeChange} value={questions[currentQuestion].type}>
                                <Option value={0}>Single Correct</Option>
                                <Option value={1}>Multiple Correct</Option>
                                <Option value={2}>Integer Type</Option>
                                <Option value={3}>Matrix</Option>
                            </Select>
                            <div>
                                Test Name: <input type="text" name="testname" value={testName} onChange={(event) => setTestName(event.target.value)} />
                            </div>
                            <div>
                                AITS: <input type="checkbox" value={aits} onChange={() => setAits(event.target.value)} />
                            </div>
                            <div>
                                Free: <input type="checkbox" value={free} onChange={() => setFree(event.target.value)} />
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
                                        
                                    </div>
                                    <div className="p-3">
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={false}
                                            name="filepond"
                                            server={{
                                                url: 'http://127.0.0.1:8000/fp',
                                                process: {
                                                    url: '/process/',
                                                    method: 'POST',
                                                    withCredentials: false,
                                                    headers: {},
                                                    timeout: 7000,
                                                    onload: (response) => response.key,
                                                    onerror: (response) => response.data,
                                                    ondata: (data) => {
                                                        console.log(data)
                                                        return data
                                                    }
                                                },
                                                patch: '/patch/',
                                                revert: '/revert/',
                                                fetch: '/fetch/?target='
                                            }}
                                            
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
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
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="btn btn-info" onClick={handleTestSave}>
                            Create Test
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