import Head from 'next/head'
import Header from "./Header"
import { SIDEBAR_ITEMS } from '../../utils/constants'
import { PRIMARY } from '../../utils/Colors'

export default function SideBarLayout(props){
    return(
        <>
            <Head>
                <title>{props.title ? `${props.title} | NewEra Coaching Classes` : `NewEra Coaching Classes`}</title>
            </Head>
            <Header full={props.header && props.header.full} />
            <div className="outer-container position-relative">
                <div className="position-fixed sidebar-container item-shadow">
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
                </div>
                <div className="content-container">
                    {props.children}
                </div>
            </div>
            <style jsx>{`
                .outer-container {
                    padding-top: 89px;
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
                }
                @media(max-width: 992px){
                    .outer-container {
                        padding-top: 58px;
                    }
                    .sidebar-container {
                        top: 58px;
                    }
                }
            `}</style>
        </>
    )
}