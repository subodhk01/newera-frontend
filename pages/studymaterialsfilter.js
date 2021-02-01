import React from 'react'
import Link from 'next/link'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import Layout from '../components/UI/Layout'
import { Empty } from 'antd'

export default function studymaterialsfilter(props){
    const { profile, accessToken } = useAuth()
    
    const [ loading, setLoading ] = React.useState(true)
    const [ name, setName ] = React.useState("dkfjjdk")
    const [ materials, setMaterials ] = React.useState()
    const [ sessions, setSessions ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        let query = JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        console.log("query: ", query)
        setName(query.name || query.exam)
        axiosInstance
            .get(`/studymaterials/${window.location.search}`)
            .then((response) => {
                console.log("study materials: ", response.data)
                setMaterials(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <Layout>
            <div className="p-2 p-md-5">
                <div className="pt-0">
                    <h2>Section : {name}</h2>
                </div>
                <div className="pt-3">
                    <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                        {loading ?
                            <>
                                Loading...
                            </>
                            :
                            <>
                                {materials && materials.length ? materials.map((item, index) => {
                                    if(true){
                                        return (
                                            <div className="item-shadow p-3 py-4 m-3 cursor-pointer border" key={index}>
                                                <h4>{item.name}</h4>
                                                <div>
                                                    {item.materials.length} Materials
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
                                                <Link href={`/studymaterials/${item.id}`} key={index}>
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