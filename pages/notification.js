import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import { useAuth } from '../utils/auth'
import { axiosInstance, baseURL } from '../utils/axios'
import axios from 'axios'
import { customStyles2 } from '../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import { Alert, Checkbox } from 'antd'
import { Select } from 'antd';
import { ServerStyleSheet } from 'styled-components'

const { Option } = Select;

const PAGES = [
    "Homepage",
    "AITS page",
    "Batches page",
    "Videos page",
    "Dashboard page",
    "Study Materials page",
    "Discussion Forum (channels page)",
    "Discussion Forum (direct messages page)",
    "About us"
]


export default function Notification(props){
    const [ subject, setSubject ] = React.useState("")
    const [ message, setMessage ] = React.useState("")
    const [ all, setAll ] = React.useState(false)
    const [ batches, setBatches ] = React.useState()
    const [ selectedBatchs, setSelectedBatchs ] = React.useState([])
    const [ page, setPage ] = React.useState(0)
    
    const [ loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")
    const [ result, setResult ] = React.useState({})

    React.useEffect(() => {
        axiosInstance.get("/batch/list/user")
            .then((response) => {
                console.log("batches: ", response.data)
                setBatches(response.data)
            }).catch((error) => {
                console.log(error)
                setError("Unable to fetch batches")
            })
    }, [])
    const handleSend = () => {
        setError("")
        setSuccess("")
        setResult({})
        setLoading(true)
        if(!subject || !message || (!selectedBatchs.length && !all)){
            setError("Please fill all fields")
            setLoading(false)
            return
        }
        var students = []
        console.log("selected abtches: ", selectedBatchs)
        var finalBatchList = batches.filter(batch => selectedBatchs.includes(batch.id))
        finalBatchList.map((batch, index) => {
            students = [ ...students, ...batch.students ]
        })
        axiosInstance.post("/sendNotification/", {
            subject: subject,
            all: all,
            message: message,
            students: students,
            page: page
        })
            .then((response) => {
                if(response.data.error){
                    setError(response.data.error)
                    setLoading(false)
                    return
                }
                console.log("notification send resp: ", response.data)
                console.log("result: ", response.data.result)
                setSuccess(response.data.success)
                setResult(response.data.result || {})
                setMessage("")
                setSubject("")
                setSelectedBatchs([])
                setLoading(false)
            }).catch((error) => {
                console.log(error)
                setError("Unable to process your request, try again")
                setLoading(false)
            })
    }
    return(
        <AuthHOC teacher>
            <SideBarLayout title="Notifications">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Notifications</h1>
                    </div>
                    <div>
                        {error &&
                            <div className="py-4">
                                <Alert type="error" description={error} />
                            </div>
                        }
                    </div>
                    {batches ?
                        <div>
                            {success &&
                                <div className="py-4">
                                    <Alert type="success" description={<div>
                                        {success}<br />
                                        {result && <div>
                                            Success: {result.success}<br /> Faliure: {result.failure}<br /><br />
                                            {result.results && result.results.map((item, index) => 
                                                <div key={index} className={`${item.error && "text-danger"} ${item.message_id && "text-success"}`}>
                                                    {index+1}. {item.error}{item.message_id}
                                                </div>
                                            )}
                                        </div>}
                                    </div>} />
                                </div>
                            }
                            <div className="form-group">
                                <label>Subject:</label>
                                <input className="form-control" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength="100" />
                            </div>
                            <div className="form-group">
                                <label className="p-2 m-1 cursor-pointer">
                                    <Checkbox checked={all} onChange={(event) => setAll(event.target.checked)}>Send to all Students</Checkbox>
                                </label>
                            </div>
                            {!all && 
                                <div className="form-group">
                                    <label>Batch:</label>
                                    <Select mode="multiple"  style={{ width: 120 }} value={selectedBatchs} onChange={(value) => setSelectedBatchs(value)}>
                                        {batches && batches.map((batch, index) => 
                                            <Option value={batch.id}>{batch.name}</Option>
                                        )}
                                    </Select>
                                </div>
                            }
                            <div className="form-group">
                                <label>Page to redirect <span className="text-muted">(Optional)</span>:</label>
                                <Select style={{ width: 120 }} value={page} onChange={(value) => setPage(value)}>
                                    {PAGES && PAGES.map((page, index) => 
                                        <Option value={index}>{page}</Option>
                                    )}
                                </Select>
                            </div>
                            <div className="form-group">
                                <label>Message:</label>
                                <textarea rows="3" className="form-control" value={message} onChange={(event) => setMessage(event.target.value)} maxLength="240" />
                            </div>
                            <div>
                                <button disabled={loading} className="btn btn-success" onClick={handleSend}>Send Notification</button>
                            </div>
                        </div>
                    :
                        <div className="text-center">
                            Loading...
                        </div>
                    }
                </div>
            </SideBarLayout>
        </AuthHOC>
    )
}