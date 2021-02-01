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

export default function MaterialCreate(props){  
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ title, setTitle ] = React.useState("")
    const [ files, setFiles ] = React.useState([])
    const [ description, setDescription ] = React.useState("")
    const [ free, setFree ] = React.useState(false)
    const [ sections, setSections ] = React.useState()
    const [ section, setSection ] = React.useState("")
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")

    React.useEffect(() => {
        props.setHeader(false)
        axiosInstance.get("/materialsections")
            .then(response => {
                console.log("topics: ", response.data)
                setSections(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const handleTestSave = () => {
        setError("")
        console.log("files: ", files)
        console.log("free: ", free)
        console.log("materialTitle: ", title)
        console.log("section: ", section)
        if(!title || !files.length){
            setError("Please fill all details")
            return
        }
        var formData = new FormData();
        formData.append("created_by", profile.id)
        formData.append("title", title)
        formData.append("material", files[0].file)
        formData.append("description", description)
        formData.append("free", free)
        axiosInstance.post("/materials/", formData ,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log("material save response: ", response.data)
            setError("Material successfully created!")
            Router.push("/studymaterials")
        }).catch((error) => {
            console.log(error)
            console.log(error.response)
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
                    <TestHeader testName={"Create Material"} />
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
                                    Create Material
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
                                                Material Title: 
                                                <input type="text" name="materialTitle" className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} />
                                            </div>
                                            <div className="col-12 p-3">
                                                <div className="font-weight-bold mb-2">Material File:</div>
                                                <FilePond
                                                    files={files}
                                                    allowMultiple={false}
                                                    name="filepond"
                                                    onupdatefiles={setFiles}
                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
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