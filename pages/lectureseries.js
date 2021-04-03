import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'
import { Empty } from 'antd'

export default function LectureSeries(props){
    const { profile, accessToken } = useAuth()
    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/lectureseries/user")
            .then((response) => {
                console.log("lecture series: ", response.data)
                setSeries(response.data)
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
                        <h1>Lecture Series</h1>
                    </div>
                    {/* <div className="pt-3">
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                            {series && series.map((item, index) =>
                                <Link href={`/lectureseries/${item.id}`} key={index}>
                                    <a className="item-shadow p-3 m-3 cursor-pointer border">
                                        {item.name}
                                    </a>
                                </Link>
                            )}
                        </div>
                    </div> */}
                    <div className="pt-3">
                        {profile.is_teacher && 
                            <div className="py-3 text-right">
                                <Link href="/lectureseries/create">
                                    <a>
                                        <div className="btn btn-success">
                                            Create New Lecture Series
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        }
                        <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
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
                                                        {item.videos.length} Videos
                                                    </div>
                                                    <hr />
                                                    <Link href={`/lectureseries/${item.id}`}>
                                                        <div className="btn btn-info">
                                                            Open
                                                        </div>
                                                    </Link>
                                                    {profile.is_teacher && 
                                                        <Link href={`/lectureseries/edit/${item.id}`}>
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
                                    <Empty description={<span>Not Registered for any Lecture Series yet</span>} />
                                }
                                </>
                            }
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .item-shadow {
                        color: grey;
                    }
                `}</style>
            </SideBarLayout>
        </AuthHOC>
    )
}