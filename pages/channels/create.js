import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../components/UI/TestHeader'
import Options from '../../components/Test/Options'

import { Select, DatePicker, Space, Checkbox } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Register the plugin
registerPlugin(FilePondPluginImagePreview);

import { arrayRemove } from '../../utils/functions'
import AuthHOC from '../../components/AuthHOC'
import { useAuth } from '../../utils/auth'


function createMarkup(data) {
    return {__html: data};
}

export default function Test(props){  
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ name, setName ] = React.useState("")
    const [ description, setDescription ] = React.useState("")
    const [ batches, setBatches ] = React.useState()
    const [ selectedBatches, setSelectedBatches ] = React.useState([])
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")

    React.useEffect(() => {
        props.setHeader(false)
        axiosInstance.get("/batch/list")
            .then((response) => {
                console.log("batch list: ", response.data)
                setBatches(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
                setError(error && error.response && error.response.data || "Unexpected error, please try again")
            })
    }, [])


    const handleChannelSave = () => {
        setError("")
        setSuccess("")
        if(!name && !description){
            setError("Please fill all details")
            return
        }
        axiosInstance.post("/channels/", {
            name: name,
            description: description,
            registered_batches: selectedBatches,
            // private: ,
            // teacher: ,
        })
        .then((response) => {
            console.log("channet save response: ", response.data)
            setSuccess("Channel successfully created!")
            Router.push("/channels")
        }).catch((error) => {
            console.log(error)
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
        })
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
                        <TestHeader testName={name} />
                        <div className="d-flex flex-wrap align-items-center p-2 border-bottom">
                            <div className="px-2">
                                <input type="text" name="channelname" className="form-control" placeholder="Channel Name" value={name} onChange={(event) => setName(event.target.value)} />
                            </div>
                            {/* <label className="p-2 m-1 cursor-pointer">
                                <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                            </label> */}
                        </div>
                    </div>
                    <div className="row no-gutters container mx-auto">
                        <div className="col-12">
                            <div className="p-3">
                                <h6>Description: </h6>
                                <textarea rows="4" type="text" name="description" className="form-control" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
                            </div>
                        </div>
                        <div className="col-12 col-lg-12">
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
                            <div className="btn btn-info" onClick={handleChannelSave}>
                                Create Channel
                            </div>
                        </div>
                    </div>
                    <style jsx>{`
                        .selected {
                            box-shadow: 0px 0px 10px 7px green;
                            transform: scale(1.02);
                        }
                    `}</style>
                </>
            }
        </AuthHOC>
    )
}