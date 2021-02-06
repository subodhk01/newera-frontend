import Link from 'next/link'
import React from 'react'
import AuthHOC from '../components/AuthHOC'
import Layout from '../components/UI/Layout'
import { useAuth } from '../utils/auth'
import { SIDEBAR_ITEMS } from '../utils/constants'

export default function Dashboard(props){
    const { profile, accessToken } = useAuth()
    React.useEffect(() => {
        props.setHeader(true)
    })
    return(
        <AuthHOC>
            <Layout title="Dashboard">
                <div className="pt-10">
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-center pt-5">
                            {SIDEBAR_ITEMS.map((item, index) =>{
                                if(item.teacher && !profile.is_teacher) return null
                                else{
                                    return (
                                        <div className="px-4 py-3 text-center" key={index}>
                                            <Link href={item.path} key={index}>
                                                <a className="item-container">
                                                    <div className="icon-container item-shadow d-flex align-items-center justify-content-center">
                                                        <div className="mt-light">{item.title}</div>
                                                    </div>
                                                    <div className="py-3 font-13 mt-bold text-muted">
                                                        {item.title}
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    )
                                }
                                
                            })}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .item-container:hover > .icon-container {
                        background-color: rgb(45 113 183 / 70%);
                        box-shadow: 0px 6px 14px 18px #6a69c51c;
                        color: white;
                    }
                    .icon-container {
                        height: 180px;
                        width: 180px;
                        border-radius: 10px;
                        transition: 0.25s;
                        color: grey;
                    }
                `}</style>
            </Layout>
        </AuthHOC>
    )
}