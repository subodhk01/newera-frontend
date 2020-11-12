import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import StudentTestTable from '../components/Tables/Test/StudentTestTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'

export default function Tests(props){
    const { profile, accessToken } = useAuth()
    const [ tests, setTests ] = React.useState()
    React.useEffect(() => {
        axiosInstance
        .get("/tests")
        .then((response) => {
            console.log("tests: ", response.data)
            setTests(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    return(
        <SideBarLayout title="Tests">
            <div className="p-2 p-md-5">
                <div>
                    <h1>Tests</h1>
                </div>
                <div>
                    <div>
                        {profile.is_student &&
                            <>
                                <StudentTestTable tests={tests} />
                            </>
                        }
                    </div>
                    <div>
                        {profile.is_teacher &&
                            <>
                                Teacher Table
                            </>
                        }
                    </div>
                </div>
            </div>
        </SideBarLayout>
    )
}