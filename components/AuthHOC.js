import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'

export default function AuthHOC(props){
    const router = useRouter()
    const { accessToken, profile } = useAuth()
    const { teacher, student, confirmEmail } = props

    React.useEffect(() => {
        // console.log("accessToken at useEffect: ", accessToken)
        console.log("Auth check, accesstoken: ", accessToken)
        console.log("profile: ", profile)
        if(!accessToken){
            console.log("No access token found, redirecting to login page")
            router.push("/login")
        }else if(!profile.is_phone_verified){
            console.log("Phone not verified, redirecting to confirm phone page page")
            router.push("/confirm_email")
        }else if(confirmEmail) {
            console.log("phone already confirmed, redirecting to dashboard")
            router.push("/dashboard")
        }
    }, [accessToken])
    
    if(accessToken && profile){
        if((teacher && !profile.is_teacher) || (student && !profile.is_student)){
            return (
                <div className="text-center" style={{ paddingTop: "150px" }}>
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