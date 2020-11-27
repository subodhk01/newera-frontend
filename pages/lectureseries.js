import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import LectureSeriesTable from '../components/Tables/LectureSeries/LectureSeriesTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck } from 'react-icons/fa'

export default function Tests(props){
    const { profile, accessToken } = useAuth()
    const [ series, setSeries ] = React.useState()
    const [ sessions, setSessions ] = React.useState()
    React.useEffect(() => {
        axiosInstance
            .get("/lectureseries")
            .then((response) => {
                console.log("lecture series: ", response.data)
                setSeries(response.data)
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
                    <div className="pt-3">
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                            {/* <LectureSeriesTable tests={series} sessions={sessions} /> */}
                            {series && series.map((item, index) =>
                                <Link href={`/series/${item.id}`} key={index}>
                                    <a className="item-shadow p-3 m-3 cursor-pointer border">
                                        {item.name}
                                    </a>
                                </Link>
                            )}
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