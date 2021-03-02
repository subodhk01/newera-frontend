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
    const [ messages, setMessages ] = React.useState()

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
                    <div className="d-flex flex-column h-100 mx-auto" style={{ maxWidth: "800px" }}>
                        <div className="flex-grow-1 w-100 p-3 p-md-4 mx-auto position-relative" >
                            {loading ?
                                <div className="text-center">
                                    Loading...
                                </div>
                                :
                                <>
                                    <div className="chat-container" style={{ height: "100%", maxWidth: "800px", overflow: "scroll" }}>
                                        <div className="msg-container">
                                            {messages && messages.map((msg, index) => 
                                                <div className={`msg-box-container position-relative ${msg.student && msg.student.id === profile.id && "ml-auto"}`}>
                                                    {msg.student &&
                                                        <>
                                                            {!(msg.student.id === profile.id) &&
                                                                <div className="text-muted">{msg.student.name}</div>
                                                            }
                                                        </>
                                                    }
                                                    {msg.teacher &&
                                                        <div className="text-warning">{msg.teacher.name}</div>
                                                    }
                                                    <div className={`msg-box ${msg.student && msg.student.id === profile.id && "ml-auto my-msg"}`} key={msg.id}>
                                                        {msg.message}
                                                    </div>
                                                    <div className="date-container text-muted">
                                                        {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={bottomRef} className="list-bottom"></div>
                                        </div>
                                        
                                    </div>
                                </>
                            }
                        </div>
                        <div className="input-container p-3 d-flex flex-shrink-1">
                            <div className="flex-grow-1 px-3">
                                <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Enter message here" className="form-control chat-input" />
                            </div>
                            <div className="flex-shrink-1">
                                <button className="btn btn-success" onClick={handleMessageSend} disabled={!message}>Send</button>
                            </div>
                        </div>
                    </div>
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