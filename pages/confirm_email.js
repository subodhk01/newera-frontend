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
    const { setProfile } = useAuth()

    const handleSubmit = async (event) => {
        setError("")
        setLoading(true)
        event.preventDefault();
        axiosInstance
            .post("email/confirm/", {
                code: code
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
            .get("sendEmail/")
            .then((response) => {
                console.log("email Response :", response.data)
                setAgain(true)
            }).catch((error) => {
                setLoading(false)
                console.log(error)
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
                        <h2 className="mt-bold mb-4">Confirm Email</h2>
                        <p>Check your email for the verification code</p>
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
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-success form-control">
                                        Comfirm Email
                                    </button>
                                    <div className="text-right mt-2">
                                        {again ?
                                            <div className="text-info">Code successfully sent, check your email</div>
                                            :
                                            <>Didn't recieve any code? {loading ? <span className="text-muted">Click here to send again</span> : <a onClick={handleReSend}>Click here to send again</a>}</>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
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
