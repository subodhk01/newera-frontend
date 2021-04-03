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
import { RiCopperCoinFill }  from 'react-icons/ri'
import CsvDownload from 'react-json-to-csv'

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

    const getProfile = () => {
        axiosInstance.get("/profile")
            .then((response) => {
                console.log("profile: ", response.data)
                setProfile(response.data)
                setName(response.data.name)
                setPhone(response.data.phone)
                setEmail(response.data.email)
            }).catch((error) => {
                console.log(error)
                setError("Unable to fetch profile")
            })
    }

    React.useEffect(() => {
        getProfile()
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
                        <>
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
                            <div className="py-4 px-2">
                                {profile.is_student && 
                                    <ReferralSection profile={profile} getProfile={getProfile} />
                                }
                            </div>
                            <div className="py-4 px-2">
                                {profile.is_superuser &&
                                    <UserListSection />
                                }
                            </div>
                        </>
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

const UserListSection = () => {
    const [ users, setUsers ] = React.useState()
    React.useEffect(() => {
        console.log("starting to fetch users")
        axiosInstance.get("/users/list")
            .then((response) => {
                console.log("user list: ", response.data)
                setUsers(response.data)
            }).catch((error) => {
                console.log(error)
                console.log(error.response)
                console.log("Unable to fetch users")
            })
    }, [])
    return(
        <div>
            {users ?
                <CsvDownload data={users} />
                :
                "Loading users"
            }
        </div>
    )
}

const ReferralSection = ({profile, getProfile}) => {
    const [ code, setCode ] = React.useState("")
    
    const [ error, setError ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")

    const handleReferral = (event) => {
        event.preventDefault()
        setError()
        setSuccess()
        axiosInstance.post("/referral/add/", {
            code: code
        })
            .then((response) => {
                console.log("referral add response: ", response.data)
                if(response.data.error){
                    setError(response.data.error)
                    return
                }
                getProfile()
                setCode()
                setSuccess(response.data.success)
                
            }).catch((error) => {
                console.log(error)
                console.log(error.response)
                setError("Unable to add referral")
            })
    }
    return (
        <div>
            <div className="item-shadow p-3 p-md-4">
                {error &&
                    <div className="py-4">
                        <Alert type="error" description={error} />
                    </div>
                }
                {success &&
                    <div className="py-4">
                        <Alert type="success" description={success} />
                    </div>
                }
                <h3>Referral</h3>
                <div className="py-3 text-center">
                    <div>YOUR REFERRAL CODE</div>
                    <div style={{ border: "2px dashed red", borderRadius: "50px" }} className="d-inline-block p-2 px-4">
                        {profile.referral_code}
                    </div>
                </div>
                {!profile.already_referred ?
                    <form onSubmit={handleReferral}>
                        <div className="form-group">
                            <label>Enter Referral Code <span className="text-muted">(Invited to Newera by a friend? enter his referral code)</span>:</label>
                            <input className="form-control" value={code} onChange={(event) => setCode(event.target.value)} maxLength="6" required />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-info">
                                Submit
                            </button>
                        </div>
                    </form>
                    :
                    <h6 className="text-center py-3 text-success">You are referred by {profile.referred_by}</h6>
                }
                {profile.coins > 0 && <h5 className="text-info">You have <RiCopperCoinFill color="gold" />{profile.coins} coins!</h5>}
                <h6>Your Referrals:</h6>
                <div>
                    {profile.referrals && !profile.referrals.length && <div className="text-muted">No Referrals, share your code to your friends to get coins</div>}
                    {profile.referrals && profile.referrals.map((student, index) => 
                        <div className="">
                            {index+1}. <strong>{student.name}</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}