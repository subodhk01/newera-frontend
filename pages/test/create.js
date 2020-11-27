import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../components/UI/TestHeader'
import { BiTimeFive } from 'react-icons/bi'
import Options from '../../components/Test/Options'
import { PRIMARY_DARK } from '../../utils/Colors'
import { Select } from 'antd';
const { Option } = Select;
import { FilePond, File, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { arrayRemove } from '../../utils/functions'

//registerPlugin(FilePondPluginImagePreview)


function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ testName, setTestName ] = React.useState("")
    const [ aits, setAits ] = React.useState(false)
    const [ free, setFree ] = React.useState(false)
    const [ questions, setQuestions ] = React.useState([{
        image: "",
        type: 0,
        topic: "none",
        section: 0,
        correctMarks: 4,
        incorrectMarks: 0,
        partialMarks: 0,
    }])
    const [ currentQuestion, setCurrentQuestion ] = React.useState(0)
    const [ answers, setAnswers ] = React.useState([{
        answer: [],
        topic: "",
        solution: ""
    }])
    const [ files, setFiles ] = React.useState([])
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")

    React.useEffect(() => {
        setLoading(false)
    }, [])
    React.useEffect(() => {
        console.log(files)
        if(files.length){
            console.log("start")
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
            newAnswers[currentQuestion].answer = arrayRemove(newAnswers[currentQuestion].answer, answer)
        }else{
            newAnswers[currentQuestion].answer.push(answer)
        }
        newAnswers[currentQuestion].answer = newAnswers[currentQuestion].answer.sort()
        newAnswers[currentQuestion].answered = true
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleNumericalCorrect = (answer) => {
        let newAnswers = answers
        newAnswers[currentQuestion].answer = answer
        newAnswers[currentQuestion].answered = true
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleMatrixCorrect = (answer, index) => {
        let newAnswers = answers
        if(newAnswers[currentQuestion].answer[index].includes(answer)){
            newAnswers[currentQuestion].answer[index] = arrayRemove(newAnswers[currentQuestion].answer[index], answer)
        }else{
            newAnswers[currentQuestion].answer[index].push(answer)
        }
        newAnswers[currentQuestion].answer[index] = newAnswers[currentQuestion].answer[index].sort()
        newAnswers[currentQuestion].answered = true
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleCorrectMarks = (event) => {
        let newQuestions = questions
        newQuestions[currentQuestion].correctMarks = event.target.value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleIncorrectMarks = (event) => {
        let newQuestions = questions
        newQuestions[currentQuestion].incorrectMarks = event.target.value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    
    const handleClear = () => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            newAnswers[currentQuestion].answer = []
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
            answer: [],
            topic: "",
            solution: ""
        }])
        setQuestions([...questions, {
            image: "",
            type: 0,
            topic: "none",
            section: 0,
            correctMarks: 4,
            incorrectMarks: 0,
            partialMarks: 0,
        }])
    }

    const handleQuestionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].image = baseURL + 'media/' + url
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const removeQuestionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].image = ""
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }


    const handleQuestionTypeChange = (value) => {
        console.log("question type value: ", value)
        let newQuestions = questions
        let newAnswers = answers
        newQuestions[currentQuestion].type = value
        if(value === 0 || value === 1){
            newAnswers[currentQuestion].answer = []
        }else if(value === 2){
            newAnswers[currentQuestion].answer = ""
        }else{
            newAnswers[currentQuestion].answer = [[],[],[],[]]
        }
        newAnswers[currentQuestion].answered = false
        setQuestions(newQuestions)
        setAnswers(answers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleTestSave = () => {
        console.log(aits, free)
        axiosInstance.post("/tests/", {
            name: testName,
            questions: questions,
            answers: answers,
            sections: [{
                start: 0,
                end: questions.length
            }],
            aits: aits,
            free: free
        })
        .then((response) => {
            console.log("test save response: ", response.data)
            setError("Test successfully created!")
            //Router.push("/tests")
        }).catch((error) => {
            console.log(error)
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
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
                        <TestHeader testName={testName} />
                        <div className="d-flex flex-wrap align-items-center p-2 border-bottom">
                            <div className="px-2">
                                Test Name: 
                                <input type="text" name="testname" className="form-control" placeholder="Test Name" value={testName} onChange={(event) => setTestName(event.target.value)} />
                            </div>
                            <label className="p-2 m-1 cursor-pointer">
                                <input type="checkbox" className="font-3 cursor-pointer" value={aits} onChange={(event) => {console.log(event.target.value); return setAits(event.target.value)}} />
                                <span className="px-2">AITS</span>
                            </label>
                            <label className="p-2 m-1 cursor-pointer">
                                <input type="checkbox" className="font-3 cursor-pointer" value={free} onChange={(event) => setFree(event.target.value)} />
                                <span className="px-2">Free</span>
                            </label>
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
                                <div className={`m-2 item-shadow circle-big`} style={{fontSize: "3rem"}} onClick={() => handleNewQuestion()}>
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
                                        {questions[currentQuestion].image && <img src={questions[currentQuestion].image} style={{maxWidth: "80%"}} />}
                                    </div>
                                    <div className="p-3">
                                        <FilePond
                                            files={""}
                                            allowMultiple={false}
                                            name="filepond"
                                            server={{
                                                process: (fieldName, file, metadata, load, error, progress, abort) => {
                                                    const formData = new FormData()
                                                    formData.append('image', file, file.name)

                                                    // aborting the request
                                                    const CancelToken = axios.CancelToken
                                                    const source = CancelToken.source()

                                                    axios({
                                                        method: 'PUT',
                                                        url: `${baseURL}question/create`,
                                                        data: formData,
                                                        cancelToken: source.token,
                                                        onUploadProgress: (e) => {
                                                            // updating progress indicator
                                                            progress(e.lengthComputable, e.loaded, e.total)
                                                        }
                                                    }).then(response => {
                                                        // passing the file id to FilePond
                                                        load(response.file)
                                                        console.log(response.data.url)
                                                        handleQuestionImage(response.data.url)
                                                    }).catch((thrown) => {
                                                        if (axios.isCancel(thrown)) {
                                                            console.log('Request canceled', thrown.message)
                                                        } else {
                                                            // handle error
                                                        }
                                                    })
                                                    // Setup abort interface
                                                    return {
                                                        abort: () => {
                                                            source.cancel('Operation canceled by the user.')
                                                            abort()
                                                        }
                                                    }
                                                },
                                                revert: (uniqueFileId, load, error) => {
                                                    removeQuestionImage()
                                                    console.log("revert called")
                                                },
                                                load: (source, load, error, progress, abort, headers) => {
                                                    console.log("load called")
                                                },
                                                fetch: (url, load, error, progress, abort, headers) => {
                                                    console.log("fetch called")
                                                },
                                                restore: (uniqueFileId, load, error, progress, abort, headers) => {
                                                    console.log("restore called")
                                                },
                                                remove: (source, load, error) => {
                                                    removeQuestionImage()
                                                    console.log("remove called")
                                                }
                                            }}
                                            
                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </div>
                                    <div>
                                        <div className="w-75 mx-auto p-1 row no-gutters">
                                            <div className="col-12 p-2">
                                                <Select defaultValue={0} style={{ width: "100%" }} onChange={handleQuestionTypeChange} value={questions[currentQuestion].type}>
                                                    <Option value={0}>Single Correct</Option>
                                                    <Option value={1}>Multiple Correct</Option>
                                                    <Option value={2}>Integer Type</Option>
                                                    <Option value={3}>Matrix</Option>
                                                </Select>
                                            </div>
                                            <div className="col-6 p-2">
                                                Correct Marks: 
                                                <input type="text" name="testname" className="form-control" value={questions[currentQuestion].correctMarks} onChange={handleCorrectMarks} />
                                            </div>
                                            <div className="col-6 p-2">
                                                Incorrect Marks: 
                                                <input type="text" name="testname" className="form-control" value={questions[currentQuestion].incorrectMarks} onChange={handleIncorrectMarks} />
                                            </div>
                                        </div>
                                        <div className="p-1">
                                            <Options 
                                                currentQuestion={currentQuestion} 
                                                question={questions[currentQuestion]} 
                                                response={answers}
                                                handleSingleCorrect={handleSingleCorrect}
                                                handleMultipleCorrect={handleMultipleCorrect}
                                                handleNumericalCorrect={handleNumericalCorrect}
                                                handleMatrixCorrect={handleMatrixCorrect}
                                                
                                            />
                                        </div>
                                        <div className="d-flex align-items-center p-3">
                                            <div className="btn btn-secondary" onClick={handleClear}>
                                                Clear response
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="p-2">
                            <div className="btn btn-info" onClick={handleTestSave}>
                                Create Test
                            </div>
                            <div>
                                {error && typeof(error) === "string" && <span className="text-danger">{error}</span>}
                                {error && typeof(error) === "object" && 
                                    Object.keys(error).map((key, index) => 
                                        <span key={index} className="text-danger">{key} : {error[key]}</span>
                                    )
                                }
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