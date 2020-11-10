import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/font.css'
import '../styles/misc.css'
import '../styles/globals.css'

import React from 'react'
import cookie from 'react-cookies'
import { AuthContext } from '../utils/auth'

function MyApp({ Component, pageProps }) {
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
	
	return (
		<AuthContext.Provider 
            value={{
                accessToken : access,
                refreshToken : refresh,
                setAccessToken : setAccessToken,
                setRefreshToken : setRefreshToken
        }}>
            <Component {...pageProps} />
        </AuthContext.Provider>
	)
}

export default MyApp
