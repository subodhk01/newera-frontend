import React from 'react'
import SideBarLayout from '../../components/UI/WithSideBar'
import StudentChannelTable from '../../components/Tables/Channel/StudentChannelTable'
import TeacherChannelTable from '../../components/Tables/Channel/TeacherChannelTable'
import { useAuth } from '../../utils/auth'
import { useRouter } from 'next/router'
import { axiosInstance } from '../../utils/axios'
import { customStyles2 } from '../../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import { Alert } from 'antd'



export default function Forum(props){
    const router = useRouter()
    const { id } = router.query

    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ channel, setChannel ] = React.useState()
    const [ messages, setMessages ] = React.useState()

    React.useEffect(() => {
        props.setHeader(true)
        if(id){
            axiosInstance
            .get(`/channels/${id}/messages/`)
            .then((response) => {
                console.log("messages: ", response.data)
                setMessages(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [id])
    return(
        <AuthHOC>
            <SideBarLayout title="Forums">
                <div className="p-2 p-md-5">
                    <div>
                        <h1></h1>
                    </div>
                    <div>
                        {loading ?
                            <div className="text-center">
                                Loading...
                            </div>
                            :
                            <>
                            
                            </>
                        }
                    </div>
                </div>
            </SideBarLayout>
        </AuthHOC>
    )
}