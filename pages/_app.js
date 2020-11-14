import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import '../styles/font.css'
import '../styles/misc.css'
import '../styles/globals.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import React from 'react'
import cookie from 'react-cookies'
import { AuthContext } from '../utils/auth'

function MyApp({ Component, pageProps }) {
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
	
	return (
		<AuthContext.Provider 
            value={{
                accessToken : access,
                refreshToken : refresh,
                setAccessToken : setAccessToken,
                setRefreshToken : setRefreshToken,
                profile : profile,
                setProfile : handleProfile
        }}>
            <Component {...pageProps} />
        </AuthContext.Provider>
	)
}

export default MyApp
