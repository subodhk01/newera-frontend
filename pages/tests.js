import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import StudentTestTable from '../components/Tables/Test/StudentTestTable'
import TeacherTestTable from '../components/Tables/Test/TeacherTestTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck } from 'react-icons/fa'

export default function Tests(props){
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ tests, setTests ] = React.useState()
    const [ sessions, setSessions ] = React.useState()
    React.useEffect(() => {
        axiosInstance
            .get("/tests")
            .then((response) => {
                console.log("tests: ", response.data)
                setTests(response.data)
            }).catch((error) => {
                console.log(error)
            })
        axiosInstance
            .get("/sessions")
            .then((response) => {
                console.log("sessions: ", response.data)
                setSessions(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <AuthHOC>
            <SideBarLayout title="Tests">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Tests</h1>
                    </div>
                    <div>
                        {loading ?
                            <>
                                Loading...
                            </>
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
                                            <TeacherTestTable tests={tests} />
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