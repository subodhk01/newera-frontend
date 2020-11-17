import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'

export default function AuthHOC(props){
    const router = useRouter()
    const { accessToken } = useAuth()
    React.useEffect(() => {
        console.log("accessToken at useEffect: ", accessToken)
        if(!accessToken){
            router.push("login")
        }
    }, [accessToken])
    return (
        <>
            {accessToken ?
                    props.children
                :
                <>
                    NotAuthorized
                </>    
            }
        </>
    )
}