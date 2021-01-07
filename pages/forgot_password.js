import React from 'react'
import { Router, useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { axiosInstance } from '../utils/axios'
import { useAuth } from '../utils/auth'
import AuthHOC from '../components/AuthHOC'

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function ConfirmEmail(props) {
    const router = useRouter()

    const [ code, setCode ] = React.useState("")
    const [ again, setAgain ] = React.useState(false)
    const [ loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")

    const [ phone, setPhone ] = React.useState("")
    const [ password1, setPassword1 ] = React.useState("")
    const [ password2, setPassword2 ] = React.useState("")
    const [ success, setSuccess ] = React.useState("")
    const [ changeScreen, setChange ] = React.useState(false)

    const { setProfile } = useAuth()

    const handleSubmit = async (event) => {
        setError("")
        setLoading(true)
        event.preventDefault();
        if(password1 != password2){
            setError("Passwords do not match")
            setLoading(false)
            return
        }
        axiosInstance
            .post("forgotpassword/", {
                phone: phone,
                otp: code,
                password1: password1,
                password2: password2
            }, config)
            .then((response) => {
                console.log("password change Response :", response.data)
                if(response.data.error){
                    setError(response.data.error)
                    setLoading(false)
                    return
                }
                setSuccess("Password changed successfully")
                setInterval(() => {
                    router.push("/login")
                }, 2000)
            })
            .catch((error) => {
                setLoading(false)
                if ( error.response && error.response.status === 401){
                    console.log(error.response.data.detail)
                    setError("Invalid Credentials")
                    return
                }
                console.log(error)
                if( error.message ) setError(error.message)
                else setError(error.toString()) 
            })
    }
    const handleReSend = () => {
        setError("")
        setLoading(true)
        axiosInstance
            .post("/forgotpassword/sendOTP/", {
                phone: phone
            })
            .then((response) => {
                console.log("otp Response :", response.data)
                setLoading(false)
                if(response.data.error){
                    setError(response.data.error)
                    return
                }
                setAgain(true)
            }).catch((error) => {
                setLoading(false)
                console.log(error)
                if( error.message ) setError(error.message)
                else setError(error.toString())
            })
    }
    const handleSendOTP = () => {
        event.preventDefault();
        setError("")
        setLoading(true)
        if(phone.length != 10){
            setError("Phone number should be 10 digits")
            setLoading(false)
            return
        }
        axiosInstance
            .post("/forgotpassword/sendOTP/", {
                phone: phone
            })
            .then((response) => {
                console.log("send OTP Response :", response.data)
                setLoading(false)
                if(response.data.error){
                    setError(response.data.error)
                    return
                }
                setChange(true)
            }).catch((error) => {
                setLoading(false)
                console.log(error)
                if( error.response && error.response.status === 400 && error.response.data.phone && error.response.data.phone.length ){
                    setError(error.response.data.phone[0])
                    return
                }
                if( error.message ) setError(error.message)
                else setError(error.toString())
            })
    }
    React.useEffect(() => {
        props.setHeader(true)
    }, [])
    return (
        <Layout>
            <div className="d-flex align-items-center justify-content-center">
                <div className="form-box item-shadow mx-auto">
                    {changeScreen ?
                        <>
                            <a onClick={() => {setError("");setChange(false)}} className="mb-3">Back</a>
                            <h2 className="mt-bold mb-4">Create New Password</h2>
                            <p>Check your phone for OTP</p>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input className="form-control" type="text" value={code} onChange={(event) => setCode(event.target.value)} name="key" placeholder="Code" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control" type="text" value={password1} onChange={(event) => setPassword1(event.target.value)} name="password1" placeholder="New Password" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="form-control" type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} name="password2" placeholder="Confirm Password" required />
                                    </div>
                                    <div>
                                        {error &&
                                            <div className="py-2 text-danger">
                                                {error}
                                            </div>
                                        }
                                        {/* <div className="text-right text-muted cursor-pointer" onClick={() => {setError("");setChange(false)}}>Click here to change Phone Number</div> */}
                                    </div>
                                    <div className="text-right mt-2">
                                        {success &&
                                            <div className="text-success">{success}</div>
                                        }
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-success form-control" disabled={loading}>
                                            Change Password
                                        </button>
                                        <div className="text-right mt-2">
                                            {again ?
                                                <div className="text-info">Code successfully sent, check your phone</div>
                                                :
                                                <>Didn't recieve any code? {loading ? <span className="text-muted">Click here to send again</span> : <a onClick={handleReSend}>Click here to send again</a>}</>
                                            }
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </>
                        :
                        <>
                            <h2 className="mt-bold mb-4">Forgot Password</h2>
                            <p>Enter your 10 digit mobile number</p>
                            <div>
                                <form onSubmit={handleSendOTP}>
                                    <div className="form-group">
                                        <input className="form-control" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} name="phone" placeholder="Phone Number" required />
                                    </div>
                                    <div>
                                        {error &&
                                            <div className="py-2 text-danger">
                                                {error}
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-success form-control" disabled={loading}>
                                            Send OTP
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    }
                </div>
            </div>
            <style jsx>{`
                .form-box {
                    margin-top: 10vh;
                    padding: 2rem;
                    width: 100%;
                    max-width: 600px;
                }
            `}</style>
        </Layout>
    )
}
