import React from 'react'
import Link from 'next/link'
import { PRIMARY, PRIMARY_DARK } from '../../utils/Colors'
import { FaChevronDown } from 'react-icons/fa'
import { RiMenu3Line, RiSafariFill } from 'react-icons/ri'
import { MdClose } from 'react-icons/md'
import { Collapse } from 'react-bootstrap'
import SingleArrowButton from '../Buttons/SingleArrowButton'

import { useAuth } from '../../utils/auth'
import { axiosInstance } from '../../utils/axios'

const logoWhite = '/static/logoWhite.png'
const logoBlack = '/static/logoBlack.png'

const HEADER_ITEMS = [
    {
        title: "Home",
        path: "/"
    },
    {
        title: "AITS",
        dropdown: true,
        items: [
            {
                title: "Loading",
                content: "",
                image: "/static/header/about.png",
                disabled: true
            }
        ]
    },
    {
        title: "Lectures",
        dropdown: true,
        items: [
            {
                title: "Loading",
                content: "",
                image: "/static/header/about.png",
                disabled: true
            }
        ]
    },
    {
        title: "Study Materials",
        dropdown: true,
        items: [
            {
                title: "Loading",
                content: "",
                image: "/static/header/about.png",
                disabled: true
            }
        ]
    },
    // {
    //     title: "Forum",
    //     path: "/"
    // },
    {
        title: "Login/Signup",
        to: "/login",
        button: true
    }
]

export default function Header(props){
    const [ headerItems, setHeaderItems ] = React.useState()
    const [ mobileNav, setMobileNav ] = React.useState(false)
    const [ mobileDropdown, setMobileDropdown ] = React.useState("")
    const { accessToken, handleLogout } = useAuth()
    const handleDropdown = (item) => {
        if(mobileDropdown == item.title){
            setMobileDropdown("")
        }else {
            setMobileDropdown(item.title)
        }
    }
    React.useEffect(() => {
        axiosInstance.get("/exams")
            .then((response) => {
                console.log("exams resp: ", response.data)
                let temp_header = HEADER_ITEMS, exams = []
                response.data.map((exam) => {
                    exams.push({
                        title: exam.name,
                        content: "",
                        image: "",
                        path: `/aits/?exam=${exam.slug}&name=${exam.name}`
                    })
                })
                temp_header[1].items = exams
                console.log("item headers: ", temp_header)
                axiosInstance.get("/videosections")
                    .then((response) => {
                        console.log("videosections resp: ", response.data)
                        let exams = []
                        response.data.map((exam) => {
                            exams.push({
                                title: exam.name,
                                content: "",
                                image: "",
                                path: `/lectureseriesfilter/?section=${exam.slug}&name=${exam.name}`
                            })
                        })
                        temp_header[2].items = exams
                        console.log("item headers: ", temp_header)
                        axiosInstance.get("/materialsections")
                            .then((response) => {
                                console.log("materialsections resp: ", response.data)
                                let exams = []
                                response.data.map((exam) => {
                                    exams.push({
                                        title: exam.name,
                                        content: "",
                                        image: "",
                                        path: `/studymaterialsfilter/?section=${exam.slug}&name=${exam.name}`
                                    })
                                })
                                temp_header[3].items = exams
                                console.log("item headers: ", temp_header)
                                setHeaderItems(temp_header)
                                
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return (
        <div className="outer-container item-shadow">
            <div className={`position-relative d-flex align-items-center ${props.full ? "full" : "container justify-content-between"}`}>
                <div className="px-3">
                    <Link href="/">
                        <a className="d-flex align-items-center py-2">
                            <img src="/images/logo_compressed.jpg" style={{height: "55px", borderRadius: "5px"}} />
                            <h6 className="ml-3 my-0 mt-light" style={{color: "#05a0e8"}}>New Era<br />The Learning Platform</h6>
                        </a>
                    </Link>
                </div>
                <div className="d-block d-lg-none">
                    <div className="p-3 cursor-pointer" onClick={() => setMobileNav(true)}>
                        <RiMenu3Line size="26" color={props.white ? "white" : "black"} />
                    </div>
                    <div className={`mobile-nav-container font-12 ${mobileNav ? "show-nav" : "hide-nav"}`}>
                        <div className="mobile-nav">
                            <div className="mobile-nav-close text-right py-3 px-4 mr-2 cursor-pointer" onClick={() => setMobileNav(false)}>
                                <MdClose size="30" color="white" />
                            </div>
                            { headerItems && headerItems.map((item, index1) => 
                                <React.Fragment key={index1}>
                                    {item.path && 
                                        <div className="py-2" onClick={() => setMobileNav(false)}>
                                            <Link href={item.path}>
                                                <a>
                                                    <div className={`position-relative`}>
                                                        {item.title}
                                                        <div className="menu-item-underline"></div>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    }
                                    {item.dropdown && 
                                        <div className="position-relative">
                                            <div className="py-2 text-white cursor-pointer" onClick={() => handleDropdown(item)}>
                                                {item.title}&nbsp;&nbsp;<FaChevronDown color={PRIMARY} size="16" className={`dropdown-icon ${mobileDropdown == item.title ? "" : "turned"}`} />
                                            </div>
                                            <Collapse in={mobileDropdown == item.title}>
                                                <div>
                                                    {item.items && item.items.map((child, index2) => 
                                                        <a href={child.path} key={index2}>
                                                            <div className="dropdown-item-mobile">
                                                                <div className="heading-bold font-12 text-white">{child.title}</div>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            </Collapse>
                                        </div>
                                    }
                                    {item.button &&
                                        <>
                                            {accessToken ?
                                                <>
                                                    <div className="py-2" onClick={() => setMobileNav(false)}>
                                                        <Link href="/dashboard">
                                                            <a className={`position-relative`}>
                                                                Dashboard
                                                                <div className="menu-item-underline"></div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div onClick={() => {handleLogout(); setMobileNav(false)}} className="py-2">
                                                        <a className={`position-relative`}>
                                                            Logout
                                                            <div className="menu-item-underline"></div>
                                                        </a>
                                                    </div>
                                                </>
                                                :
                                                <div className="text-center py-4 position-relative" style={{left: "-20px"}} onClick={() => setMobileNav(false)}>
                                                     <Link href={item.to}>
                                                        <a>
                                                            <SingleArrowButton>
                                                                {item.title}
                                                            </SingleArrowButton>
                                                        </a>
                                                    </Link>
                                                </div>
                                            }
                                        </>
                                    }
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-none d-lg-flex align-items-center">
                    { HEADER_ITEMS.map((item, index1) => 
                        <React.Fragment key={`desktopNav${index1}`}>
                            {item.path && 
                                <div>
                                    <Link href={item.path}>
                                        <a className={`menu-item position-relative`}>
                                            {item.title}
                                            <div className="menu-item-underline"></div>
                                        </a>
                                    </Link>
                                </div>
                            }
                            {item.dropdown && 
                                <div className="position-relative">
                                    <div className="menu-item">
                                        {item.title}&nbsp;&nbsp;<FaChevronDown color={PRIMARY} size="16" className="dropdown-icon" />
                                        <div className="menu-item-underline"></div>
                                    </div>
                                    <div className="dropdown-container" style={{left: "-70px"}}>
                                        <div className="dropdown d-flex flex-column align-items-center justify-content-center">
                                            {item.items && item.items.map((child, index2) => {
                                                if(item.disabled){
                                                    return "Loading..."
                                                }else{
                                                    return (
                                                        <a href={child.path} key={index2}>
                                                            <div className="dropdown-item">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="heading-bold font-1">{child.title}</div>
                                                                </div>
                                                                <div className="content font-08">{child.content}</div>
                                                            </div>
                                                        </a>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                            {item.button &&
                                <>
                                    {accessToken ?
                                        <div className="d-flex">
                                            <div key={'dashboard-button'}>
                                                <Link href="/dashboard" key={'dashboard-link-button'}>
                                                    <a className={`menu-item position-relative`}>
                                                        Dashboard
                                                        <div className="menu-item-underline"></div>
                                                    </a>
                                                </Link>
                                            </div>
                                            <div onClick={() => handleLogout()}>
                                                <a className={`menu-item position-relative`}>
                                                    Logout
                                                    <div className="menu-item-underline"></div>
                                                </a>
                                            </div>
                                        </div>
                                        :
                                        <div className="btn btn-arrow ml-3 d-flex" key={'auth-button'}>
                                            <Link href={item.to}>
                                                <a>
                                                    <SingleArrowButton>
                                                        {item.title}
                                                    </SingleArrowButton>
                                                </a>
                                            </Link>
                                        </div>
                                    }
                                </>
                            }
                        </React.Fragment>
                    )}
                    <div>

                    </div>
                </div>
            </div>
            <style jsx>{`
                .outer-container {
                    ${props.white ? `background: black;` : `background: white;` }
                    ${props.transparent ? `background: transparent;` : ""}
                    transition: 0.3s !important;
                    position: fixed;
                    z-index: 3;
                    width: 100%;
                    font-size: 0.9rem;
                    font-family: madetommy-regular;
                }
                img {
                    max-height: 70px;
                }
                .menu-item {
                    cursor: pointer;
                    text-decoration: none;
                    padding: 34px 20px;
                    color: grey;
                    transition: 0.2s;
                }
                .menu-item-underline {
                    position: absolute;
                    bottom: 24px;
                    left: 20px;
                    height: 3px;
                    width: 0px;
                    background: ${PRIMARY};
                    transition: 0.2s;
                }
                .menu-item:hover {
                    color: black;
                }
                .menu-item:hover > .menu-item-underline {
                    width: 36px;
                }
                .active {
                    font-weight: bold;
                }
                .heading-bold {
                    color: black;
                }
                .content {
                    color: rgba(0,0,0,0.8);
                }
                .dropdown-container {
                    opacity: 0;
                    z-index: -1;
                    position: absolute;
                    top: -280px;
                    transition: 0.3s opacity;
                }
                .dropdown {
                    background: white;
                    margin-top: 10px;
                    box-shadow: 0px 0px 20px 1px rgba(0,0,0,0.2);
                    border-radius: 6px;
                    overflow: hidden;
                }
                .dropdown-item {
                    padding: 15px 15px;
                    width: 220px;
                    white-space: normal;
                    transition: 0.2s;
                }
                .dropdown-item-mobile {
                    padding: 10px 35px;
                }
                .menu-item:hover + .dropdown-container {
                    opacity: 1;
                    top: 88px;
                }
                .dropdown-item:hover {
                    background: ${PRIMARY};
                }
                .dropdown-item:hover .heading-bold {
                    color: white;
                }
                .dropdown-item:hover .content {
                    color: white;
                }
                .dropdown-item img {
                    max-height: 35px;
                    margin: 5px;
                    border-radius: 5px;
                }
                .dropdown-container:hover {
                    opacity: 1;
                    top: 88px;
                }
                .mobile-nav-container {
                    position: fixed;
                    z-index: 1;
                    background: black;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    padding-left: 50px;
                    transition: 0.4s;
                }
                .show-nav {
                    top: 0vh;
                }
                .hide-nav {
                    top -100vh;
                }
                .turned {
                    transform: rotate(180deg);
                }
            `}</style>
        </div>
    )
}
