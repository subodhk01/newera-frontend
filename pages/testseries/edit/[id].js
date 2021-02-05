import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'
import Options from '../../../components/Test/Options'

import { Select, DatePicker, Space, Checkbox } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Register the plugin
registerPlugin(FilePondPluginImagePreview);

import { arrayRemove } from '../../../utils/functions'
import AuthHOC from '../../../components/AuthHOC'
import { useAuth } from '../../../utils/auth'


function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const router = useRouter()
    const { id } = router.query
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ testSeriesName, setTestSeriesName ] = React.useState("")
    const [ image, setImage ] = React.useState()
    const [ free, setFree ] = React.useState(false)
    const [ price, setPrice ] = React.useState()
    const [ dateTime, setDateTime ] = React.useState()
    const [ duration, setDuration ] = React.useState(180)
    const [ tests, setTests ] = React.useState()
    const [ exams, setExams ] = React.useState()
    const [ batches, setBatches ] = React.useState()
    const [ selectedTests, setSelectedTests ] = React.useState([])
    const [ selectedExam, setSelectedExam ] = React.useState([])
    const [ selectedBatches, setSelectedBatches ] = React.useState([])
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")

    React.useEffect(() => {
        if(id){
            props.setHeader(false)
            axiosInstance.get(`/tests/`)
                .then((response) => {
                    console.log("tests list: ", response.data)
                    setTests(response.data)
                }).catch((error) => {
                    console.log(error)
                    setError(error && error.response && error.response.data || "Unexpected error, please try again")
                })
            axiosInstance.get(`/batch/list`)
                .then((response) => {
                    console.log("batches list: ", response.data)
                    setBatches(response.data)
                }).catch((error) => {
                    console.log(error)
                    setError(error && error.response && error.response.data || "Unexpected error, please try again")
                })
            axiosInstance.get("/exams/")
                .then((response) => {
                    console.log("exams list: ", response.data)
                    setExams(response.data)
                    let exams = response.data
                    axiosInstance.get(`/testseries/${id}`)
                        .then((response) => {
                            console.log("testseries get: ", response.data)
                            let testseries = response.data, temptests = [], tempbatches = []
                            setTestSeriesName(testseries.name)
                            setPrice(testseries.price)
                            setSelectedExam(testseries.exams && testseries.exams.length && testseries.exams[0].id)
                            testseries.tests.map((test) => {temptests.push(test.id)})
                            testseries.registered_batches.map((batch) => {tempbatches.push(batch.id)})
                            setSelectedTests(temptests)
                            setSelectedBatches(tempbatches)
                            setLoading(false)
                        }).catch((error) => {
                            console.log(error)
                            setError(error && error.response && error.response.data || "Unexpected error, please try again")
                        })
                }).catch((error) => {
                    console.log(error)
                    setError(error && error.response && error.response.data || "Unexpected error, please try again")
                })
        }
    }, [id])


    const handleTestSeriesSave = () => {
        setError("")
        setSuccess("")
        if(!testSeriesName){
            setError("Please fill all details and mark answers to all the questions")
            return
        }
        console.log(selectedExam, selectedTests, selectedBatches)
        axiosInstance.patch(`/testseries/${id}/`, {
            name: testSeriesName,
            price: free ? 0 : price,
            tests: selectedTests,
            exams: [selectedExam, ],
            registered_batches: selectedBatches,
            visible: true
        })
        .then((response) => {
            console.log("test series update response: ", response.data)
            setSuccess("Test Series successfully created!")
        }).catch((error) => {
            console.log(error)
            console.log(error.response && error.response.data)
            setError(error && error.response && typeof(error.response.data) === "object" && "sddff" )
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
        })
    }

    const handleTestSelect = (testid) => {
        let newTests = selectedTests
        if(newTests.includes(testid)){
            newTests = arrayRemove(newTests, testid)
        }else{
            newTests.push(testid)
        }
        setSelectedTests(newTests)
        setRender((render + 1) % 100) // a pseudo update
    }
    const handleBatchSelect = (batchid) => {
        let newBatches = selectedBatches
        if(newBatches.includes(batchid)){
            newBatches = arrayRemove(newBatches, batchid)
        }else{
            newBatches.push(batchid)
        }
        setSelectedBatches(newBatches)
        setRender((render + 1) % 100) // a pseudo update
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
                        <TestHeader testName={testSeriesName} />
                        <div className="d-flex flex-wrap align-items-center p-2 border-bottom">
                            <div className="px-2">
                                <input type="text" name="testname" className="form-control" placeholder="Test Series Name" value={testSeriesName} onChange={(event) => setTestSeriesName(event.target.value)} />
                            </div>
                            {/* <div className="p-2">
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
                            </div> */}
                            <label className="p-2 m-1 cursor-pointer">
                                <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                            </label>
                            {!free && 
                                <div className="px-2">
                                    <input type="number" name="price" className="form-control" placeholder="Test Series Price" value={price} onChange={(event) => setPrice(event.target.value)} />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-12">
                            <div className="p-3">
                                <div className="font-weight-bold mb-2">Test series banner:</div>
                                <FilePond
                                    //files={image}
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
                                                setImage(response.data.url)
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
                                            setImage()
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
                                            setImage()
                                            console.log("remove called")
                                        }
                                    }}

                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                            <div className="p-3">
                                <h6>Tests: </h6>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    {tests && tests.map((test, index) =>
                                        <div className={`item-shadow p-3 py-4 m-3 cursor-pointer border text-center ${selectedTests.includes(test.id) && "selected"}`} key={index} onClick={() => handleTestSelect(test.id)}>
                                            <h5>{test.name}</h5>
                                            <hr />
                                            <div>
                                                Free: {test.free ? "YES" : "NO"}<br />

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-3">
                                <h6>Batches: </h6>
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    {batches && batches.map((batch, index) =>
                                        <div className={`item-shadow p-3 py-4 m-3 cursor-pointer border text-center ${selectedBatches.includes(batch.id) && "selected"}`} key={index} onClick={() => handleBatchSelect(batch.id)}>
                                            <h5>{batch.name}</h5>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-75 mx-auto p-1 row no-gutters">
                                <div className="col-12 p-2">
                                    <Select defaultValue={0} style={{ width: "100%" }} onChange={(value) => setSelectedExam(value)} value={selectedExam}>
                                        {exams && exams.map((exam, index) =>
                                            <Option value={exam.id}>{exam.name}</Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <div>
                                {success && <span className="text-success">{success}</span>}
                                {error && typeof(error) === "string" && <span className="text-danger">{error}</span>}
                                {error && typeof(error) === "object" && 
                                    Object.keys(error).map((key, index) => 
                                        <span key={index} className="text-danger">{key} : {error[key]}</span>
                                    )
                                }
                            </div>
                            <div className="btn btn-info" onClick={handleTestSeriesSave}>
                                Update Test Series
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
                        .selected {
                            box-shadow: 0px 0px 10px 7px green;
                            transform: scale(1.1);
                        }
                        
                    `}</style>
                </>
            }
        </AuthHOC>
    )
}