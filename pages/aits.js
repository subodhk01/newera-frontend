import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import LectureSeriesTable from '../components/Tables/LectureSeries/LectureSeriesTable'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import AuthHOC from '../components/AuthHOC'
import Layout from '../components/UI/Layout'
import { FaHockeyPuck } from 'react-icons/fa'
import { Empty } from 'antd'

export default function TestSeries(props){
    const { profile, accessToken } = useAuth()
    
    const [ loading, setLoading ] = React.useState(true)
    const [ name, setName ] = React.useState("dkfjjdk")
    const [ series, setSeries ] = React.useState()
    const [ sessions, setSessions ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        let query = JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        console.log("query: ", query)
        setName(query.name || query.exam)
        axiosInstance
            .get(`/testseries/${window.location.search}`)
            .then((response) => {
                console.log("test series: ", response.data)
                setSeries(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <Layout>
            <div className="p-2 p-md-5">
                <div className="pt-0">
                    <h2>Exam : {name}</h2>
                </div>
                <div className="pt-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                        {loading ?
                            <>
                                Loading...
                            </>
                            :
                            <>
                                {series && series.length ? series.map((item, index) => {
                                    if(true){
                                        return (
                                            <div className="item-shadow p-3 py-4 m-3 cursor-pointer border" key={index}>
                                                <h4>{item.name}</h4>
                                                <div>
                                                    {item.tests.length} Tests
                                                </div>
                                                <div className="font-12 mt-bold text-right">
                                                    {item.free || item.price === 0 ?
                                                            <div className="text-success">Free</div>
                                                        :
                                                            <div>
                                                                &#8377;{item.price}
                                                            </div>
                                                        }
                                                </div>
                                                <hr />
                                                <Link href={`/testseries/${item.id}`} key={index}>
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
                                <div>
                                    <Empty description="Coming soon..." />
                                </div>
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
        </Layout>
    )
}