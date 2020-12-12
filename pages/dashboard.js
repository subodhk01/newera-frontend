import Link from 'next/link'
import React from 'react'
import AuthHOC from '../components/AuthHOC'
import Layout from '../components/UI/Layout'
import { SIDEBAR_ITEMS } from '../utils/constants'

export default function Dashboard(props){
    React.useEffect(() => {
        props.setHeader(true)
    })
    return(
        <AuthHOC>
            <Layout title="Dashboard">
                <div className="pt-10">
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-center pt-5">
                            {SIDEBAR_ITEMS.map((item, index) =>
                                <div className="px-4 py-3 text-center" key={index}>
                                    <Link href={item.path} key={index}>
                                        <a className="item-container">
                                            <div className="icon-container item-shadow">

                                            </div>
                                            <div className="py-3 font-13 mt-bold text-muted">
                                                {item.title}
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .item-container:hover > .icon-container {
                        background-color: rgba(100,100,255,0.2);
                        box-shadow: 0px 0px 1px 1px white;
                    }
                    .icon-container {
                        height: 180px;
                        width: 180px;
                        border-radius: 10px;
                        transition: 0.7s;
                    }
                `}</style>
            </Layout>
        </AuthHOC>
    )
}