import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'

export default function AuthHOC(props){
    const router = useRouter()
    const { accessToken, profile } = useAuth()
    const { teacher, student } = props

    React.useEffect(() => {
        console.log("accessToken at useEffect: ", accessToken)
        console.log("profile: ", profile)
        if(!accessToken){
            router.push("/login")
        }
    }, [accessToken])
    
    if(accessToken && profile){
        if((teacher && !profile.is_teacher) || (student && !profile.is_student)){
            return (
                <div>
                    You are not authorized to view this page
                </div>
            )
        }
        return (
            props.children
        )
    }else{
        return (
            <div>
                NotAuthorized
            </div>
        )
    }
}