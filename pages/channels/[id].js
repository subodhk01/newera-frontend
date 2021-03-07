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
import { RiRefreshFill } from 'react-icons/ri'
import Link from 'next/link'
import { Alert } from 'antd'
import ChatBox from '../../components/Chat/ChatBox'



export default function Forum(props){
    const router = useRouter()
    const { id } = router.query

    const { profile, accessToken } = useAuth()

    const bottomRef = React.useRef();
    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        });
    };

    const [ loading, setLoading ] = React.useState(true)
    const [ channel, setChannel ] = React.useState()
    const [ messages, setMessages ] = React.useState([])

    const [ message, setMessage ] = React.useState("")
    const [ image, setImage ] = React.useState("")

    const getMessages = () => {
        axiosInstance
            .get(`/channels/${id}/messages/`)
            .then((response) => {
                console.log("messages: ", response.data)
                setMessages(response.data)
                setLoading(false)
                scrollToBottom()
            }).catch((error) => {
                console.log(error)
            })
    }

    React.useEffect(() => {
        props.setHeader(true)
        if(id){
            axiosInstance
                .get(`/channels/${id}/`)
                .then((response) => {
                    console.log("channel: ", response.data)
                    setChannel(response.data)
                }).catch((error) => {
                    console.log(error)
                })
            getMessages()
        }
    }, [id])

    React.useEffect(() => {
        if(bottomRef && bottomRef.current) {
            console.log("scrooling")
            scrollToBottom()
        }
    }, [messages])

    const handleMessageSend = () => {
        axiosInstance
            .post(`/channels/${id}/messages/`, {
                message: message,
                // image: image
            })
            .then((response) => {
                console.log("message sent resp: ", response.data)
                setMessages(msg => [...msg, {...response.data, timestamp: new Date(), student: {id: profile.id}}])
                setMessage("")
                setImage("")
                scrollToBottom()
            }).catch((error) => {
                console.log(error)
                console.log(error.response)
            })
    }

    return(
        <AuthHOC>
            <SideBarLayout title="Forums">
                <div className="p-2 p-md-5 h-100 flex flex-column">
                    <div>
                        <h1 className="m-0">{channel && <div>{channel.name} <RiRefreshFill size="22" color="#61adf1d9" className="cursor-pointer" onClick={getMessages} /></div>}</h1>
                    </div>
                    <ChatBox
                        loading={loading}
                        profile={profile}
                        bottomRef={bottomRef}
                        message={message}
                        setMessage={setMessage}
                        messages={messages}
                        setMessages={setMessages}
                        handleMessageSend={handleMessageSend}
                    />
                </div>
                
            </SideBarLayout>
        </AuthHOC>
    )
}