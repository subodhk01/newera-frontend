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




export default function Notification(props){
    const { profile, setProfile } = useAuth()

    const [ name, setName ] = React.useState()
    const [ phone, setPhone ] = React.useState()
    const [ email, setEmail ] = React.useState()
    const [ all, setAll ] = React.useState(false)
    const [ selectedBatchs, setSelectedBatchs ] = React.useState([])
    
    const [ loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")
    const [ result, setResult ] = React.useState({})

    React.useEffect(() => {
        axiosInstance.get("/profile")
            .then((response) => {
                console.log("profile: ", response.data)
                setProfile(response.data)
                setName(response.data.name)
                setPhone(response.data.phone)
                setEmail(response.data.email)
            }).catch((error) => {
                console.log(error)
                setError("Unable to fetch batches")
            })
    }, [])
    const handleSave = (event) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)
        if(!name || !email || !phone){
            setError("Please fill all fields")
            setLoading(false)
            return
        }
        if(phone.length != 10){
            setError("Invalid Phone Number")
            setLoading(false)
            return
        }
        axiosInstance.patch("/profile/", {
            name: name,
            phone: phone,
            email: email,
        })
            .then((response) => {
                if(response.data.error){
                    setError(response.data.error)
                    setLoading(false)
                    return
                }
                console.log("profile update resp: ", response.data)
                setSuccess("Profile updated successfully")
                setProfile(response.data)
                setName(response.data.name)
                setPhone(response.data.phone)
                setEmail(response.data.email)
                setLoading(false)
            }).catch((error) => {
                console.log(error.response)
                setError("Unable to process your request, try again")
                setLoading(false)
            })
    }
    return(
        <AuthHOC>
            <SideBarLayout title="Profile">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Profile</h1>
                    </div>
                    <div>
                        {error &&
                            <div className="py-4">
                                <Alert type="error" description={error} />
                            </div>
                        }
                    </div>
                    {profile ?
                        <form onSubmit={handleSave}>
                            {success &&
                                <div className="py-4">
                                    <Alert type="success" description={success} />
                                </div>
                            }
                            <div className="form-group row no-gutters">
                                <div className="col-12 col-md-6 p-2">
                                    <label>Name:</label>
                                    <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} maxLength="100" required />
                                </div>
                                <div className="col-12 col-md-6 p-2">
                                    <label>Phone:</label>
                                    <input className="form-control" type="number" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength="100" required />
                                </div>
                            </div>
                            <div className="form-group row no-gutters">
                                <div className="col-12 col-md-6 p-2">
                                    <label>Email:</label>
                                    <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength="100" required />
                                </div>
                            </div>
                            <div>
                                <button disabled={loading} className="btn btn-success" type="submit">Update Profile</button>
                            </div>
                        </form>
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