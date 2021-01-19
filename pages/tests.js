import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import StudentTestTable from '../components/Tables/Test/StudentTestTable'
import TeacherTestTable from '../components/Tables/Test/TeacherTestTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import { customStyles2 } from '../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'



export default function Tests(props){
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ tests, setTests ] = React.useState()
    const [ sessions, setSessions ] = React.useState()

    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/tests")
            .then((response) => {
                console.log("tests: ", response.data)
                setTests(response.data)
                if(profile.is_teacher) setLoading(false)
                if(profile.is_student){
                    axiosInstance
                        .get("/sessions")
                        .then((response) => {
                            console.log("sessions: ", response.data)
                            setSessions(response.data)
                            setLoading(false)
                        }).catch((error) => {
                            console.log(error)
                        })
                }
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
            .delete(`/tests/${activeId}`)
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
                        <h1>Tests</h1>
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
                                            <StudentTestTable tests={tests} sessions={sessions} />
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
                                                <Link href="/test/create">
                                                    <a>
                                                        <div className="btn btn-success">
                                                            Create New Test
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                            <TeacherTestTable tests={tests} deleteTest={deleteTest} />
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