import React from 'react'
import { axiosInstance } from '../../../utils/axios'
import { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'

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
    const [ name, setName ] = React.useState("")
    const [ description, setDescription ] = React.useState("")
    const [ batches, setBatches ] = React.useState()
    const [ selectedBatches, setSelectedBatches ] = React.useState([])
    const [ render, setRender ] = React.useState(0)
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")

    React.useEffect(() => {
        if(id){
            props.setHeader(false)
            axiosInstance.get(`/batch/list`)
                .then((response) => {
                    console.log("batches list: ", response.data)
                    setBatches(response.data)
                    axiosInstance.get(`/channels/${id}`)
                        .then((response) => {
                            console.log("channel get: ", response.data)
                            let channel = response.data
                            setName(channel.name)
                            setDescription(channel.description)
                            setSelectedBatches(channel.registered_batches)
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


    const handleChannelSave = () => {
        setError("")
        setSuccess("")
        if(!name){
            setError("Please fill all details")
            return
        }
        console.log("selectedBatches: ", selectedBatches)
        axiosInstance.patch(`/channels/${id}/`, {
            name: name,
            description: description,
            registered_batches: selectedBatches,
            // private: ,
            // teacher: ,
        })
        .then((response) => {
            console.log("channel update response: ", response.data)
            setSuccess("Channel successfully created!")
        }).catch((error) => {
            console.log(error)
            console.log(error.response && error.response.data)
            setError(error && error.response && typeof(error.response.data) === "object" && "sddff" )
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
                                <input type="text" name="lecturename" className="form-control" placeholder="Lecture Series Name" value={name} onChange={(event) => setName(event.target.value)} />
                            </div>
                            {/* <label className="p-2 m-1 cursor-pointer">
                                <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                            </label> */}
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-12">
                            <div className="p-3">
                                <h6>Description: </h6>
                                <textarea rows="4" type="text" name="description" className="form-control" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
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
                                Update Channel
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