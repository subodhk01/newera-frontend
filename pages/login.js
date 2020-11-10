import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { axiosInstance } from '../utils/axios'
import { useAuth } from '../utils/auth'

export default function Home() {
    const router = useRouter()

    const [ isLoggedIn, setLoggedIn ] = React.useState(false)
    const [ email, setEmail ]  = React.useState("")
    const [ password, setPassword ] = React.useState("")
    const [ error, setError ] = React.useState("")
    const { setAccessToken, setRefreshToken } = useAuth()

    const handleSubmit = async (event) => {
        setError("")
        event.preventDefault();
        try{
            delete axiosInstance.defaults.headers["Authorization"]
            setAccessToken("")
            setRefreshToken("")
            const response = await axiosInstance
                .post("token/", {
                    email: email,
                    password: password,
                })
                .then((response) => {
                    console.log("Login Response :", response)
                    axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;
                    setAccessToken(response.data.access)
                    setRefreshToken(response.data.refresh)
                    setLoggedIn(true)
                    router.push('/dashboard')
                    //props.history.push("/");
                })
            console.log('response: ', response)
        } catch (error){
            if ( error.response && error.response.status === 403){
                console.log(error.response.data.detail)
                setError(error.response.data.detail)
                return
            }
            console.log(error)
            if( error.message ) setError(error.message)
            else setError(error.toString())
        }
    }

    // if( isLoggedIn ){
    //     return <Redirect to="/dashboard" />
    // }
    return (
        <Layout>
            <div>
                <div>
                    <h2>Login</h2>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-success form-control">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
