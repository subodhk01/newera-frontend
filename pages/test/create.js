import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../components/UI/TestHeader'
import Options from '../../components/Test/Options'
import { IoIosCloseCircle } from 'react-icons/io'

import { Select, DatePicker, Space, Checkbox, Alert } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

import { FilePond } from 'react-filepond'
import { arrayRemove } from '../../utils/functions'
import AuthHOC from '../../components/AuthHOC'
import { useAuth } from '../../utils/auth'


function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ testName, setTestName ] = React.useState("")
    const [ aits, setAits ] = React.useState(false)
    const [ free, setFree ] = React.useState(false)
    const [ dateTime, setDateTime ] = React.useState()
    const [ duration, setDuration ] = React.useState(180)
    const [ sections, setSections ] = React.useState([])
    const [ topics, setTopics ] = React.useState()
    const [ newSection, setNewSection ] = React.useState("")
    const [ questions, setQuestions ] = React.useState([{
        section: "",
        image: "",
        type: 0,
        text: "",
        topic: "none",
        section: 0,
        correctMarks: 4,
        incorrectMarks: 0,
        partialMarks: 0,
        option1text: "",
        option2text: "",
        option3text: "",
        option4text: ""
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
        props.setHeader(false)
        axiosInstance.get("/topics/list")
            .then(response => {
                console.log("topics: ", response.data)
                setTopics(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
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
    const handleQuestionText = (event) => {
        let newQuestions = questions
        newQuestions[currentQuestion].text = event.target.value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleOptionText = (option, value) => {
        let newQuestions = questions
        newQuestions[currentQuestion][`option${option}text`] = value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    
    const handleClear = () => {
        let newAnswers = answers
        if(newAnswers[currentQuestion]){
            if(questions[currentQuestion].type === 0 || questions[currentQuestion].type === 1){
                newAnswers[currentQuestion].answer = []
            }else if(questions[currentQuestion].type === 2){
                newAnswers[currentQuestion].answer = ""
            }else{
                newAnswers[currentQuestion].answer = [[],[],[],[]]
            }
        }
        setAnswers(newAnswers)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleNewSection = () => {
        if(!newSection) return
        setSections(sections => [...sections, newSection])
        setNewSection("")
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleSectionRemove = (section) => {
        let oldSections = sections
        oldSections =  oldSections.filter((value) => {
            console.log(value, section, value != section)
            return value != section
        })
        console.log(oldSections)
        setSections(oldSections)
        setQuestions(questions => {
            console.log("old questions: ", questions)
            questions.map((question) => {
                console.log("before: ", question.section)
                if(question.section === section) question.section = ""
                console.log("after: ", question.section)
            })
            console.log("new questions: ", questions)
            return questions
        })
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
            text: "",
            topic: "none",
            section: 0,
            correctMarks: 4,
            incorrectMarks: 0,
            partialMarks: 0,
            section: "",
            option1text: "",
            option2text: "",
            option3text: "",
            option4text: ""
        }])
    }

    const handleQuestionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].image = baseURL + 'media/' + url
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleSolutionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].solution = baseURL + 'media/' + url
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const removeQuestionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].image = ""
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }
    const removeSolutionImage = (url) => {
        let newQuestions = questions
        newQuestions[currentQuestion].solution = ""
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

    const handleTopicChange = (value) => {
        let newQuestions = questions
        newQuestions[currentQuestion].topic = value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleSectionChange = (value) => {
        let newQuestions = questions
        newQuestions[currentQuestion].section = value
        setQuestions(newQuestions)
        setRender((render + 1) % 100) // a pseudo update
    }

    const handleTestSave = () => {
        setError("")
        console.log("aits: ", aits, " - free: ", free)
        if(!testName || !dateTime || !duration){
            setError("Please fill all details and mark answers to all the questions")
            return
        }
        if(!sections.length){
            setError("There should be at least one section")
            return
        }
        axiosInstance.post("/tests/", {
            name: testName,
            created_by: profile.id,
            questions: questions,
            answers: answers,
            sections: sections,
            aits: aits,
            free: free,
            activation_time: dateTime[0].toDate(),
            closing_time: dateTime[1].toDate(),
            time_alotted: duration*60
        })
        .then((response) => {
            console.log("test save response: ", response.data)
            setError("Test successfully created!")
            Router.push("/tests")
        }).catch((error) => {
            console.log(error)
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
        })
    }

    return(
        <AuthHOC teacher>
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
                                <input type="text" name="testname" className="form-control" placeholder="Test Name" value={testName} onChange={(event) => setTestName(event.target.value)} />
                            </div>
                            <div className="p-2">
                                <RangePicker
                                    size={"large"}
                                    value={dateTime}
                                    onChange={(value) => {console.log(value); return setDateTime(value)}}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            </div>
                            <div className="p-2">
                                <input type="number" name="duration" className="form-control" placeholder="Duration (in Minutes)" value={duration} onChange={(event) => setDuration(event.target.value)} />
                            </div>
                            <label className="p-2 m-1 cursor-pointer">
                                <Checkbox checked={aits} onChange={(event) => setAits(event.target.checked)}>AITS</Checkbox>
                            </label>
                            <label className="p-2 m-1 cursor-pointer">
                                <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                            </label>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-3 border-right px-2 py-4">
                            <div>
                                <div className="d-flex flex-wrap justify-content-center mb-4">
                                    {sections && sections.length ? sections.map((section, index) =>
                                        <div className="d-flex" key={`section-${index}`}>
                                            <div className={`font-09 mr-0 btn d-flex align-items-center btn-left ${questions[currentQuestion].section === section ? 'btn-warning' : 'btn-hollow text-muted'}`} key={`section-${index}`} onClick={() => handleSectionChange(section)}>
                                                {section}
                                            </div>
                                            <div className="btn ml-0 btn-danger py-0 px-2 d-flex align-items-center btn-right" onClick={() => handleSectionRemove(section)} style={{right: "5px", top: "3px"}}><IoIosCloseCircle size="24" /></div>
                                        </div>
                                    )
                                    :
                                        <Alert description="No sections created" />
                                    }
                                </div>
                            </div>
                            <div>
                                {!questions[currentQuestion].section && <Alert type="warning" className="px-2 py-1 mb-4 d-flex align-items-center" description="No section selected for the current question" />}
                            </div>
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
                            <div>
                                <div className="row no-gutters align-item-center mt-3">
                                    <div className="col-7 p-2">
                                        <input type="text" className="form-control" value={newSection} onChange={(event) => setNewSection(event.target.value)} placeholder="Section Name" />
                                    </div>
                                    <div className="col-5 p-2">
                                        <div className="btn btn-info font-07 w-100 h-100 m-0 d-flex align-items-center justify-content-center" onClick={handleNewSection}>
                                            Add Section
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-5 text-center">
                                <div>
                                    {error && typeof(error) === "string" && <span className="text-danger">{error}</span>}
                                    {error && typeof(error) === "object" && 
                                        Object.keys(error).map((key, index) => 
                                            <span key={index} className="text-danger">{key} : {error[key]}</span>
                                        )
                                    }
                                </div>
                                <div className="btn btn-success" onClick={handleTestSave}>
                                    Create Test
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
                                    <div className="p-3 text-center">
                                        {questions[currentQuestion].image && <img src={questions[currentQuestion].image} style={{maxWidth: "80%"}} />}
                                    </div>
                                    <div className="p-3 text-center">
                                        {questions[currentQuestion].solution && <img src={questions[currentQuestion].solution} style={{maxWidth: "80%"}} />}
                                    </div>
                                    <div className="p-3">
                                        <FilePond
                                            files={""}
                                            allowMultiple={false}
                                            name="filepond-question"
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
                                            
                                            labelIdle='Drag & Drop your question image or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </div>
                                    <div className="p-3">
                                    <FilePond
                                            files={""}
                                            allowMultiple={false}
                                            name="filepond-solution"
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
                                                        handleSolutionImage(response.data.url)
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
                                                    removeSolutionImage()
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
                                                    removeSolutionImage()
                                                    console.log("remove called")
                                                }
                                            }}
                                            
                                            labelIdle='Drag & Drop your solution image or <span class="filepond--label-action">Browse</span>'
                                        />
                                    </div>
                                    <div>
                                        <div className="w-75 mx-auto p-1 row no-gutters">
                                            <div className="col-12 p-2">
                                                Section: {questions[currentQuestion].section}

                                                {/* <Select style={{ width: "100%" }} onChange={handleSectionChange} value={questions[currentQuestion].section}>
                                                    {sections && sections.map((section, index) => 
                                                        <Option value={index}>{section}</Option>
                                                    )}
                                                </Select> */}
                                            </div>
                                            <div className="col-12 p-2">
                                                Question Type: 
                                                <Select defaultValue={0} style={{ width: "100%" }} onChange={handleQuestionTypeChange} value={questions[currentQuestion].type}>
                                                    <Option value={0}>Single Correct</Option>
                                                    <Option value={1}>Multiple Correct</Option>
                                                    <Option value={2}>Integer Type</Option>
                                                    <Option value={3}>Matrix</Option>
                                                </Select>
                                            </div>
                                            <div className="col-6 p-2">
                                                Correct Marks: 
                                                <input type="text" name="correctMarks" className="form-control" value={questions[currentQuestion].correctMarks} onChange={handleCorrectMarks} />
                                            </div>
                                            <div className="col-6 p-2">
                                                Incorrect Marks: 
                                                <input type="text" name="incorrectMarks" className="form-control" value={questions[currentQuestion].incorrectMarks} onChange={handleIncorrectMarks} />
                                            </div>
                                            <div className="col-12 p-2">
                                                Topic: 
                                                <Select
                                                    showSearch
                                                    style={{ width: "100%" }}
                                                    placeholder="Choose Topic"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                    value={questions[currentQuestion].topic}
                                                    onChange={handleTopicChange}
                                                >
                                                    {topics && topics.map((topic, index) =>
                                                        <Option value={topic.name}>{topic.name}</Option>
                                                    )}
                                                </Select>
                                            </div>
                                            <div className="col-12 p-2">
                                                Question Text <span className="text-muted">(Optional)</span>: 
                                                <input type="text" name="questiontext" className="form-control" value={questions[currentQuestion].text} onChange={handleQuestionText} />
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
                                                handleOptionText={handleOptionText}
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
        </AuthHOC>
    )
}