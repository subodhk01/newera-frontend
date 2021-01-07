import React from 'react'
import Router, { useRouter } from 'next/router'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import SideBarLayout from '../../../components/UI/WithSideBar'
import TestResultTable from '../../../components/Tables/Test/TestResultTable'
import { useAuth } from '../../../utils/auth'
import { axiosInstance } from '../../../utils/axios'
import { customStyles2 } from '../../../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../../../components/AuthHOC'



export default function TestResult(props){
    const router = useRouter()
    const { id } = router.query
    
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ test, setTest ] = React.useState()
    const [ students, setStudents ] = React.useState()
    const [ sessions, setSessions ] = React.useState()

    React.useEffect(() => {
        if(id){
            props.setHeader(true)
            axiosInstance
                .get(`/tests/${id}`)
                .then((response) => {
                    console.log("test response: ", response.data)
                    setTest(response.data)
                }).catch((error) => {
                    console.log(error)
                })
            axiosInstance
                .get(`/ranks/${id}`)
                .then((response) => {
                    console.log("sessions response: ", response.data)
                    let newStudents = {}
                    response.data.map((session, index) => {
                        if(!newStudents[session.name]){
                            newStudents[session.name] = {
                                sessions: [],
                                rank: -1
                            }
                        }
                        if(newStudents[session.name].rank < 0 || newStudents[session.name].rank > session.ranks.overall){
                            newStudents[session.name].rank = session.ranks.overall
                        }
                        newStudents[session.name]['sessions'].push({
                            id: session.id,
                            marks: session.marks,
                            practice: session.practice,
                            ranks: session.ranks
                        })
                    })
                    setStudents(newStudents)
                    setSessions(response.data)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }, [id])

    return(
        <AuthHOC teacher>
            <SideBarLayout title="Test Results">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Test Results - {test && test.name}</h1>
                    </div>
                    <div>
                        {!(test && sessions) ?
                            <div className="text-center">
                                Loading...
                            </div>
                            :
                            <>
                                <div>
                                    <TestResultTable students={students} sessions={sessions} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </SideBarLayout>
        </AuthHOC>
    )
}