import React from 'react'
import Router from 'next/router'
import SideBarLayout from '../../components/UI/WithSideBar'
import StudentChannelTable from '../../components/Tables/Channel/StudentChannelTable'
import TeacherChannelTable from '../../components/Tables/Channel/TeacherChannelTable'
import { useAuth } from '../../utils/auth'
import { axiosInstance } from '../../utils/axios'
import { customStyles2 } from '../../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import { Alert } from 'antd'



export default function Forum(props){
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ channels, setChannels ] = React.useState()
    const [ sessions, setSessions ] = React.useState()

    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/teacherchannels")
            .then((response) => {
                console.log("channels: ", response.data)
                setChannels(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])

    const [ open, setOpen ] = React.useState(false)
    const [ activeId, setActiveId ] = React.useState()
    const [ deleting, setDeleting ] = React.useState(false)
    const deleteChannel = (id) => {
        setActiveId(id)
        setOpen(true)
    }
    const confirmDelete = () => {
        setDeleting(true)
        axiosInstance
            .delete(`/channels/${activeId}`)
            .then((response) => {
                console.log("channel delete response: ", response.data)
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            })
    }
    const onAskClick = (teacher) => {
        console.log("teacherId: ", teacher)
        axiosInstance
            .get(`/teacherchannels/withTeacherId/${teacher}/`)
            .then((response) => {
                console.log("teacher channel: ", response.data)
                Router.push(`/teacherchannels/${response.data.id}`)
            }).catch((error) => {
                console.log(error)
            })
    }
    return(
        <AuthHOC>
            <SideBarLayout title="Teachers">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Teachers</h1>
                    </div>
                    <div>
                        {loading ?
                            <div className="text-center">
                                Loading...
                            </div>
                            :
                            <>
                                <div>
                                    {profile.is_student &&
                                        <>
                                            <StudentChannelTable channels={channels} sessions={sessions} teacher={true} onAskClick={onAskClick} />
                                        </>
                                    }
                                </div>
                                <div>
                                    {profile.is_teacher &&
                                        <>
                                            <Modal
                                                isOpen={open}
                                                onRequestClose={() => setOpen(false)}
                                                style={customStyles2}
                                                contentLabel="Example Modal"
                                                ariaHideApp={false}
                                                shouldCloseOnOverlayClick={false}
                                            >
                                                <div className="text-center">
                                                    {!deleting ?
                                                        <div>
                                                            <div className="mb-3">
                                                                Confirm Delete Channel
                                                            </div>
                                                            <div className="btn btn-danger" onClick={confirmDelete}>
                                                                Delete Channel
                                                            </div>
                                                            <div className="btn btn-warning" onClick={() => setOpen(false)}>
                                                                Cancel
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>
                                                            Deleting Channel...
                                                        </div>
                                                    }
                                                </div>
                                            </Modal>
                                            <TeacherChannelTable channels={channels} deleteChannel={deleteChannel} teacher={true} />
                                        </>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
            </SideBarLayout>
        </AuthHOC>
    )
}