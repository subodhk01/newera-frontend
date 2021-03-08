import React from 'react'
import Head from 'next/head'
import Header from "./Header"
import { SIDEBAR_ITEMS } from '../../utils/constants'
import { PRIMARY } from '../../utils/Colors'

import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    BookOutlined,
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined,
    FileImageOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd'
import Link from 'next/link';
import { useAuth } from '../../utils/auth'

const { Content, Footer, Sider } = Layout;

export default function SideBarLayout(props){
    const { profile, accessToken } = useAuth()
    const [ INDEX, setINDEX ] = React.useState(-1)
    const ICONS = {
        '/tests': <UploadOutlined />,
        '/testseries': <BookOutlined />,
        '/report': <BookOutlined />,
        '/videos': <VideoCameraOutlined />,
        '/lectureseries': <VideoCameraOutlined />,
        '/material': <BookOutlined />,
        '/studymaterials': <BookOutlined />,
        '/onlineclasses': <CloudOutlined />,
        '/profile': <UserOutlined />,
        '/image_upload': <FileImageOutlined />,
    }
    React.useEffect(() => {
        const current_path = `/${document.location.pathname.split("/")[1]}`
        SIDEBAR_ITEMS.map((item, index) => {
            if(current_path === item.path){
                setINDEX(index)
            }
        })
    }, [])
    return(
        <>
            <Head>
                <title>{props.title ? `${props.title} | NewEra Coaching Classes` : `NewEra Coaching Classes`}</title>
            </Head>
            <div className="side-outer-container position-relative" style={{ height: "100%", paddingTop: "89px" }}>
                {/* <div className="position-fixed sidebar-container item-shadow">
                    <div className="sidebar d-flex flex-column align-items-center justify-content-center pt-5">
                        {SIDEBAR_ITEMS.map((child, index2) =>
                            <a href={child.path} key={index2}>
                                <div className="sidebar-item">
                                    <div className="d-flex align-items-center">
                                        <div className="heading-bold font-1">{child.title}</div>
                                    </div>
                                    <div className="content font-08">{child.content}</div>
                                </div>
                            </a>
                        )}
                    </div>
                </div> */}
                <Sider collapsible theme="light" breakpoint="lg" collapsedWidth="80" width="300" className="site-layout-background"
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        top: "120px",
                        left: 0,
                    }}
                >
                    <Menu mode="inline" selectedKeys={[INDEX.toString(),]}>
                        {SIDEBAR_ITEMS.map((child, index) =>{
                            if(child.teacher && !profile.is_teacher) return null
                            else{
                                return (
                                    <Menu.Item key={index} icon={ICONS[child.path]} className="py-lg-2 font-10 d-flex align-items-center" style={{height: "auto"}}>
                                        <Link href={child.path}>
                                            <a>
                                                {child.title}
                                            </a>
                                        </Link>
                                    </Menu.Item>
                                )
                            }
                        })}
                    </Menu>
                </Sider>
                <div className="content-container">
                    {props.children}
                </div>
            </div>
            <style jsx>{`
                .side-outer-container {
                    padding-top: 89px;
                    height: 100%;
                }
                .sidebar-container {
                    left: 0;
                    top: 89px;
                    bottom: 0;
                    width: 300px;
                }
                .sidebar a {
                    width: 100%;
                }
                .sidebar-item {
                    padding: 1rem 1rem 1rem 2.2rem;
                    white-space: normal;
                    transition: 0.2s;
                }
                .sidebar-item:hover {
                    background: ${PRIMARY};
                    color: white;
                }
                .content-container {
                    padding-left: 300px;
                    height: 100%;
                    transition: 0.3s;
                }
                @media(max-width: 992px){
                    .outer-container {
                        padding-top: 58px;
                    }
                    .sidebar-container {
                        top: 58px;
                    }
                    .content-container {
                        padding-left: 80px;
                    }
                }
            `}</style>
        </>
    )
}