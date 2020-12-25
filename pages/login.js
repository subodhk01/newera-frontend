import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { axiosInstance } from '../utils/axios'
import { useAuth } from '../utils/auth'

export default function Login(props) {
    const router = useRouter()

    const [ signup, setSignup ] = React.useState(false)
    const [ isLoggedIn, setLoggedIn ] = React.useState(false)
    const [ name, setName ] = React.useState("")
    const [ email, setEmail ]  = React.useState("")
    const [ phone, setPhone ] = React.useState("")
    const [ password, setPassword ] = React.useState("")
    const [ password2, setPassword2 ] = React.useState("")
    const [ loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")
    const { setAccessToken, setRefreshToken, setProfile } = useAuth()

    const handleSubmit = async (event) => {
        setError("")
        setLoading(true)
        event.preventDefault();
        delete axiosInstance.defaults.headers["Authorization"]
        setAccessToken("")
        setRefreshToken("")
        axiosInstance
            .post("token/", {
                email: email,
                password: password,
            })
            .then((response) => {
                console.log("Login Response :", response.data)
                axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access
                setAccessToken(response.data.access)
                setRefreshToken(response.data.refresh)
                axiosInstance
                    .get("profile/")
                    .then((response) => {
                        console.log("Profile Response :", response.data)
                        setProfile(response.data)
                        axiosInstance
                            .get("sendEmail/")
                            .then((response) => {
                                console.log("email send response: ", response.data)
                                setLoggedIn(true)
                                router.push("/dashboard")
                            }).catch((error) => {
                                setLoading(false)
                                console.log(error)
                            })
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

    const handleSignupSubmit = async (event) => {
        setError("")
        setLoading(true)
        event.preventDefault();
        delete axiosInstance.defaults.headers["Authorization"]
        setAccessToken("")
        setRefreshToken("")
        if(password != password2){
            setError("Passwords do not match")
            return
        }
        axiosInstance
            .post("register/", {
                name: name,
                phone: phone,
                email: email,
                password: password,
                is_student: true
            })
            .then((response) => {
                console.log("Register Response :", response.data)
                setProfile(response.data)
                axiosInstance
                    .post("token/", {
                        email: email,
                        password: password
                    })
                    .then((response) => {
                        console.log("Token Response :", response.data)
                        axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access
                        setAccessToken(response.data.access)
                        setRefreshToken(response.data.refresh)
                        axiosInstance
                            .get("sendEmail/")
                            .then((response) => {
                                console.log("email send response: ", response.data)
                                setLoggedIn(true)
                                router.push("/dashboard")
                            }).catch((error) => {
                                setLoading(false)
                                console.log(error)
                            })
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
                if( error.response && error.response.status === 400 && error.response.data.email && error.response.data.email.length ){
                    setError(error.response.data.email[0])
                    return
                }
                if( error.response && error.response.status === 400 && error.response.data.phone && error.response.data.phone.length ){
                    setError(error.response.data.phone[0])
                    return
                }
                console.log(error.response)
                if( error.message ) setError(error.message)
                else setError(error.toString()) 
            })
    }

    // if( isLoggedIn ){
    //     return <Redirect to="/dashboard" />
    // }
    React.useEffect(() => {
        props.setHeader(true)
    }, [])
    return (
        <Layout>
            <div className="d-flex align-items-center justify-content-center">
                <div className="form-box item-shadow">
                    <h2 className="mt-bold mb-4">{ signup ? "Signup" : "Login" }</h2>
                    {signup ?
                        <div>
                            <form onSubmit={handleSignupSubmit}>
                                <div className="form-group">
                                    <input className="form-control" type="text" value={name} onChange={(event) => setName(event.target.value)} name="name" placeholder="Full Name" required />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} name="email" placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="text" value={phone} onChange={(event) => setPhone(event.target.value)} name="phone" placeholder="Phone No" required />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} name="password" placeholder="Enter Password" required />
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
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-success form-control" disabled={loading}>
                                        Signup
                                    </button>
                                    <div className="text-right mt-2">
                                        Already have an account? <a onClick={() => setSignup(false)}>Click here to Login</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        :
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} name="email" placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} name="password" placeholder="password" required />
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
                                        Login
                                    </button>
                                    <div className="text-right mt-2">
                                        New here? <a onClick={() => setSignup(true)}>Click here to create account</a>
                                    </div>
                                </div>
                            </form>
                        </div>
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
