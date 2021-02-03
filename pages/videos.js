import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import StudentVideoTable from '../components/Tables/Video/StudentVideoTable'
import TeacherVideoTable from '../components/Tables/Video/TeacherVideoTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import { customStyles2 } from '../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import { Alert } from 'antd'



export default function Tests(props){
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ videos, setVideos ] = React.useState()
    const [ sessions, setSessions ] = React.useState()

    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/videos")
            .then((response) => {
                console.log("videos: ", response.data)
                setVideos(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])

    const [ open, setOpen ] = React.useState(false)
    const [ activeId, setActiveId ] = React.useState()
    const [ deleting, setDeleting ] = React.useState(false)
    const deleteTest = (id) => {
        setActiveId(id)
        setOpen(true)
    }
    const confirmDelete = () => {
        setDeleting(true)
        axiosInstance
            .delete(`/videos/${activeId}`)
            .then((response) => {
                console.log("test delete response: ", response.data)
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            })
    }
    return(
        <AuthHOC>
            <SideBarLayout title="Tests">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Videos</h1>
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
                                            <div className="py-4">
                                                <Alert description="You can watch all our videos and streams only on our Mobile Application. You can download our application from Play Store." />
                                            </div>
                                            <StudentVideoTable tests={videos} sessions={sessions} />
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
                                                                Confirm Delete Test
                                                            </div>
                                                            <div className="btn btn-danger" onClick={confirmDelete}>
                                                                Delete Test
                                                            </div>
                                                            <div className="btn btn-warning" onClick={() => setOpen(false)}>
                                                                Cancel
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>
                                                            Deleting Test...
                                                        </div>
                                                    }
                                                </div>
                                            </Modal>
                                            <div className="py-3 text-right">
                                                <Link href="/video/create">
                                                    <a>
                                                        <div className="btn btn-success">
                                                            Create New Video
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                            <TeacherVideoTable videos={videos} deleteTest={deleteTest} />
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