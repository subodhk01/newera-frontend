import Link from 'next/link'
import Header from '../components/Header/Header'

const DASHBOARD_DATA = [
    {
        image: "",
        title: "Tests",
        path: "/dashboard"
    },
    {
        image: "",
        title: "Free Tests",
        path: "/dashboard"
    },
    {
        image: "",
        title: "Assignments",
        path: "/dashboard"
    },
    {
        image: "",
        title: "Online Classes",
        path: "/dashboard"
    },
    {
        image: "",
        title: "Report",
        path: "/dashboard"
    },
    {
        image: "",
        title: "Profile",
        path: "/dashboard"
    },
]

export default function Dashboard(props){
    return(
        <>
            <Header />
            <div className="pt-10">
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-center pt-5">
                        {DASHBOARD_DATA.map((item, index) =>
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
        </>
    )
}