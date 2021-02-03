import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import { Empty } from 'antd'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'

export default function StudyMaterials(props){
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/studymaterials/user")
            .then((response) => {
                console.log("studymaterials: ", response.data)
                setSeries(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <AuthHOC>
            <SideBarLayout title="Study Materials">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>{profile.is_student && "My "}Study Materials</h1>
                    </div>
                    <div className="pt-3">
                        {profile.is_teacher && 
                            <div className="py-3 text-right">
                                <Link href="/studymaterials/create">
                                    <a>
                                        <div className="btn btn-success">
                                            Create New Study Material
                                        </div>
                                    </a>
                                </Link>
                                <Link href="/material/create">
                                    <a>
                                        <div className="btn btn-info">
                                            Create New Material
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
                                                <div className="item-shadow p-3 py-4 m-3 cursor-pointer border" key={index}>
                                                    <h4>{item.name}</h4>
                                                    <div>
                                                        {item.materials.length} Materials
                                                    </div>
                                                    <hr />
                                                    <Link href={`/studymaterials/${item.id}`}>
                                                        <div className="btn btn-info">
                                                            Open
                                                        </div>
                                                    </Link>
                                                    {profile.is_teacher && 
                                                        <Link href={`/studymaterials/edit/${item.id}`}>
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
                                    <Empty description={<span>Not Purchased any Study Material yet</span>} />
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