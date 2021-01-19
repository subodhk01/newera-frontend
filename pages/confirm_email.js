import React from 'react'
import { useRouter } from 'next/router'
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
    const [ success, setSuccess ] = React.useState("")
    const [ changeScreen, setChange ] = React.useState(false)

    const { setProfile } = useAuth()

    const handleSubmit = async (event) => {
        setError("")
        setLoading(true)
        event.preventDefault();
        axiosInstance
            .post("phone/confirm/", {
                otp: code
            }, config)
            .then((response) => {
                console.log("Key set Response :", response.data)
                if(response.data.error){
                    setError(response.data.error)
                    setLoading(false)
                    return
                }
                axiosInstance
                    .get("profile/")
                    .then((response) => {
                        console.log("Profile Response :", response.data)
                        setProfile(response.data)
                        router.push("/dashboard")
                    }).catch((error) => {
                        setLoading(false)
                        console.log(error)
                        if( error.message ) setError(error.message)
                        else setError(error.toString())
                    })
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
            .get("sendOTP/")
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
    const handlePhoneChange = () => {
        event.preventDefault();
        setError("")
        setLoading(true)
        if(phone.length != 10){
            setError("Phone number should be 10 digits")
            setLoading(false)
            return
        }
        axiosInstance
            .patch("profile/", {
                phone: phone
            })
            .then((response) => {
                console.log("profile patch Response :", response.data)
                if(response.data.error){
                    setError(response.data.error)
                    setLoading(false)
                    return
                }
                axiosInstance
                    .get("sendOTP/")
                    .then((response) => {
                        console.log("otp Response :", response.data)
                        setLoading(false)
                        if(response.data.error){
                            setError(response.data.error)
                            return
                        }
                        setSuccess("Phone Number updated successfully, check for new OTP")
                        setChange(false)
                    }).catch((error) => {
                        setLoading(false)
                        console.log(error)
                        if( error.message ) setError(error.message)
                        else setError(error.toString())
                    })
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
            <AuthHOC confirmEmail>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="form-box item-shadow mx-auto">
                        {!changeScreen ?
                            <>
                                <h2 className="mt-bold mb-4">Confirm phone</h2>
                                <p>Check your phone for OTP</p>
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <input className="form-control" type="text" value={code} onChange={(event) => setCode(event.target.value)} name="key" placeholder="Code" required />
                                        </div>
                                        <div>
                                            {error &&
                                                <div className="py-2 text-danger">
                                                    {error}
                                                </div>
                                            }
                                            <div className="text-right text-muted cursor-pointer" onClick={() => {setError("");setChange(true)}}>Click here to change Phone Number</div>
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-success form-control" disabled={loading}>
                                                Comfirm Phone
                                            </button>
                                            <div className="text-right mt-2">
                                                {again ?
                                                    <div className="text-info">Code successfully sent, check your phone</div>
                                                    :
                                                    <>Didn't recieve any code? {loading ? <span className="text-muted">Click here to send again</span> : <a onClick={handleReSend}>Click here to send again</a>}</>
                                                }
                                            </div>
                                            <div className="text-right mt-2">
                                                {success &&
                                                    <div className="text-success">{success}</div>
                                                }
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                            :
                            <>
                                <h2 className="mt-bold mb-4">Change Phone Number</h2>
                                <a onClick={() => setChange(false)}>Back</a>
                                <p>You phone number should be 10 digits</p>
                                <div>
                                    <form onSubmit={handlePhoneChange}>
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
                                                Change Phone Number
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
            </AuthHOC>
        </Layout>
    )
}
