import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import 'video.js/dist/video-js.min.css'
import "video-react/dist/video-react.css"
import '../styles/font.css'
import '../styles/flickity.css'
import '../styles/globals.css'
import '../styles/misc.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import React from 'react'
import cookie from 'react-cookies'
import { AuthContext } from '../utils/auth'
import Head from 'next/head'
import Header from '../components/UI/Header'
import { axiosInstance } from '../utils/axios'

function MyApp({ Component, pageProps }) {
    const [ header, setHeader ] = React.useState(true)

    const [ profile, setProfile ] = React.useState(cookie.load('profile') || {})
	const [ access, setAccess ] = React.useState(cookie.load('access_token'))
    const [ refresh, setRefresh ] = React.useState(cookie.load('refresh_token'))
    const setAccessToken = (token) => {
        cookie.save('access_token', token)
        setAccess(token)
    }
    const setRefreshToken = (token) => {
        cookie.save('refresh_token', token)
        setRefresh(token)
    }
    const handleProfile = (data) => {
        cookie.save('profile', data)
        setProfile(data)
    }
    const handleLogout = () => {
        cookie.remove('access_token')
        setAccess(null)
        cookie.remove('refresh_token')
        setRefresh(null)
        cookie.remove('profile')
        setProfile({})
    }

    React.useState(() => {
        if(profile && profile.id){
            axiosInstance.post("/verify/")
                .then((response) => {
                    console.log("verify response: ", response.data)
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
                axiosInstance.get("/notifications/list/")
                .then((response) => {
                    console.log("notif: ", response.data)
                })
                .catch((error) => {
                    console.log(error)
                    console.log(error.response)
                })
        }
    }, [])
	
	return (
		<AuthContext.Provider 
            value={{
                accessToken : access,
                refreshToken : refresh,
                setAccessToken : setAccessToken,
                setRefreshToken : setRefreshToken,
                handleLogout: handleLogout,
                profile : profile,
                setProfile : handleProfile
        }}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            {header &&
                <Header full />
            }
            <Component {...pageProps} setHeader={setHeader} />
        </AuthContext.Provider>
	)
}

export default MyApp
