import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'
import { IoIosCloseCircle } from 'react-icons/io'

import { Select, DatePicker, Space, Checkbox, Alert } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

import AuthHOC from '../../../components/AuthHOC'
import { useAuth } from '../../../utils/auth'


function createMarkup(data) {
    return {__html: data};
}

export default function VideoCreate(props){  
    const router = useRouter()
    const { id } = router.query

    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ videoTitle, setVideoTitle ] = React.useState("")
    const [ url, setURL ] = React.useState("")
    const [ description, setDescription ] = React.useState("")
    const [ free, setFree ] = React.useState(false)
    const [ startTime, setStartTime ] = React.useState()
    const [ sections, setSections ] = React.useState()
    const [ section, setSection ] = React.useState("")
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")

    React.useEffect(() => {
        props.setHeader(false)
        if(id){
            axiosInstance.get("/videosections")
                .then(response => {
                    console.log("topics: ", response.data)
                    setSections(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
            axiosInstance.get(`videos/${id}/`).then((response) => {
                console.log("video response: ", response.data)
                let video = response.data
                setVideoTitle(video.title)
                setURL(video.url)
                setDescription(video.description)
                setFree(video.free)
                setStartTime(moment(new Date(video.start_time)))
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [])

    const handleTestSave = () => {
        setError("")
        console.log("free: ", free)
        if(!videoTitle || !startTime){
            setError("Please fill all details")
            return
        }
        axiosInstance.patch(`/videos/${id}/`, {
            title: videoTitle,
            url: url,
            start_time: startTime.toDate(),
            description: description,
            //section: section,
            free: free
            
        })
        .then((response) => {
            console.log("video save response: ", response.data)
            setError("Video successfully updated!")
        }).catch((error) => {
            console.log(error)
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
        })
    }

    const handleStartTime = (date, dateString) => {
        console.log(date, dateString)
        setStartTime(date)
    }

    return(
        <AuthHOC teacher>
            { loading ?
                <div>
                    Loading...
                </div>
                :
                <>
                    <TestHeader testName={"Create Video"} />
                    <div className="row no-gutters pt-4">
                        <div className="col-12 col-lg-3 border-right px-2 py-4">
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
                                    Update Video
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9">
                            {questionLoading ?
                                <div>
                                    Loading
                                </div> :
                                <>
                                    <div>
                                        <div className="w-75 mx-auto p-1 row no-gutters">
                                            <div className="col-12 p-2">
                                                Video Title: 
                                                <input type="text" name="videoTitle" className="form-control" value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} />
                                            </div>
                                            <div className="col-6 p-2">
                                                Video URL: 
                                                <input type="text" name="videoURL" className="form-control" value={url} onChange={(event) => setURL(event.target.value)} />
                                            </div>
                                            
                                            <div className="col-6 p-2">
                                                <label>
                                                    Start Time
                                                </label>
                                                <div>
                                                    <DatePicker
                                                        //size={"large"}
                                                        value={startTime}
                                                        onChange={handleStartTime}
                                                        // showTime={{
                                                        //     hideDisabledOptions: true,
                                                        //     defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                        // }}
                                                        className="form-control"
                                                        format="YYYY-MM-DD"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 p-2">
                                                <label className="p-2 m-1 cursor-pointer">
                                                    <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                                                </label>
                                            </div>
                                            {/* <div className="col-12 p-2">
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
                                                    value={section}
                                                    onChange={(value) => setSection(value)}
                                                >
                                                    {sections && sections.map((topic, index) =>
                                                        <Option value={topic.name}>{topic.name}</Option>
                                                    )}
                                                </Select>
                                            </div> */}
                                            <div className="col-12 p-2">
                                                Description: 
                                                <textarea rows="3" type="text" name="description" className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} />
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