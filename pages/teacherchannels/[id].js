import React from 'react'
import SideBarLayout from '../../components/UI/WithSideBar'
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
    const [ render, setRender ] = React.useState(0)

    const bottomRef = React.useRef();
    const scrollToBottom = () => {
        if(bottomRef && bottomRef.current){
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const [ loading, setLoading ] = React.useState(true)
    const [ channel, setChannel ] = React.useState()
    const [ messages, setMessages ] = React.useState([])

    const [ active, setActive ] = React.useState("msg")
    const [ message, setMessage ] = React.useState("")
    const [ image, setImage ] = React.useState("")
    const [ pdf, setPdf] = React.useState("")

    const getMessages = () => {
        axiosInstance
            .get(`/teacherchannels/${id}/messages/`)
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
                .get(`/teacherchannels/${id}/`)
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
            .post(`/teacherchannels/${id}/messages/`, {
                message: message,
                image: image,
                pdf: pdf
            })
            .then((response) => {
                console.log("message sent resp: ", response.data)
                setMessages(msg => [...msg, {...response.data, timestamp: new Date(), student: {id: profile.id}}])
                setMessage("")
                setImage("")
                setPdf("")
                scrollToBottom()
                setRender((render + 1) % 100)
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
                        <h1 className="m-0">{channel && channel.teacher && channel.teacher.user && <div>{channel.teacher.user.name} <RiRefreshFill size="22" color="#61adf1d9" className="cursor-pointer" onClick={getMessages} /></div>}</h1>
                    </div>
                    <ChatBox
                        loading={loading}
                        profile={profile}
                        bottomRef={bottomRef}

                        active={active}
                        setActive={setActive}
                        message={message}
                        setMessage={setMessage}
                        image={image}
                        setImage={setImage}
                        pdf={pdf}
                        setPdf={setPdf}

                        messages={messages}
                        setMessages={setMessages}
                        handleMessageSend={handleMessageSend}
                    />
                </div>
                <style jsx>{`
                    .chat-container {
                        // position: relative;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                    .msg-container {
                        
                    }
                    .input-container {
                        
                    }
                    .msg-box-container {
                        margin: 5px 0px;
                        width: fit-content;
                    }
                    .msg-box {
                        padding: 0.7rem 1rem;
                        background: rgb(77 204 140 / 50%);
                        border-radius: 15px;
                        width: fit-content;
                    }
                    .date-container {
                        margin-left: auto;
                        width: fit-content;
                        position: relative;
                        right: 0px;
                        top: -5px;
                        background: white;
                        font-size: 0.7rem;
                        border: 1px solid silver;
                        border-radius: 50px;
                        padding: 0.1rem 0.6rem;
                    }
                    .my-msg {
                        background: rgb(97 173 241 / 50%);
                    }
                `}</style>
            </SideBarLayout>
        </AuthHOC>
    )
}