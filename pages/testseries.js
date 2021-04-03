import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import { Empty } from 'antd'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'

export default function TestSeries(props){
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/testseries/user")
            .then((response) => {
                console.log("test series: ", response.data)
                setSeries(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <AuthHOC>
            <SideBarLayout title="Test Series">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>{profile.is_student && "My "}Test Series</h1>
                    </div>
                    <div className="pt-3">
                        {profile.is_teacher && 
                            <div className="py-3 text-right">
                                <Link href="/testseries/create">
                                    <a>
                                        <div className="btn btn-success">
                                            Create New Test Series
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        }
                        <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                            {/* <LectureSeriesTable tests={series} sessions={sessions} /> */}
                            {loading ?
                                <>
                                    Loading...
                                </>
                                :
                                <>
                                    {series && series.length ? series.map((item, index) => {
                                        if(item.registered_students.includes(profile.id) || profile.is_teacher){
                                            return (
                                                <div className="item-shadow p-2 py-3 m-3 cursor-pointer border" key={index}>
                                                    {item.banner && <img src={item.banner} style={{ maxWidth: "270px", borderRadius: "20px" }} />}
                                                    <h4>{item.name}</h4>
                                                    <div>
                                                        {item.tests.length} Tests
                                                    </div>
                                                    <hr />
                                                    <Link href={`/testseries/${item.id}`}>
                                                        <div className="btn btn-info">
                                                            Open
                                                        </div>
                                                    </Link>
                                                    {profile.is_teacher && 
                                                        <Link href={`/testseries/edit/${item.id}`}>
                                                            <div className="btn btn-warning">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            )
                                        }
                                    })
                                    :
                                    <Empty description={<span>Not Registered for any Test Series yet</span>} />
                                }
                                </>
                            }
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .item-shadow {
                        color: grey;
                        min-width: 280px;
                    }
                `}</style>
            </SideBarLayout>
        </AuthHOC>
    )
}