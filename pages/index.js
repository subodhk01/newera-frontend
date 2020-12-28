import Link from 'next/link'
import React from 'react'
import Layout from '../components/UI/Layout'
import { axiosInstance } from '../utils/axios'

export default function Home(props) {
    const [ exams, setExams ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance.get("/exams/")
            .then((response) => {
                setExams(response.data)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
    }, [])
    return (
        <Layout>
            <div className="py-5">
                <div className="text-center py-5 px-2">
                    <h1 className="mt-bold">
                        Welcome to<br />
                        New Era Online Coaching
                    </h1>
                    <p className="text-muted py-3">
                        We provide free online education to student for JEE , NEET-UG, BIT-SAT. Join our Test Series for the best results.
                    </p>
                    {/* <div className="d-flex flex-column">
                        <div className="mx-auto" style={{maxWidth: "400px"}}>
                            <div className="btn btn-success mt-bold font-13 w-100 m-3 py-2">
                                Payment Form
                            </div>
                            <div className="btn btn-success mt-bold font-13 w-100 m-3 py-2">
                                Super 40 Entrance
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="d-flex align-items-strech justify-content-center flex-wrap py-5">
                        <div className="feature">
                            <div>
                                <img className="border-circle" src="/images/teacher.png" />
                            </div>
                            <div>
                                <h3 className="mt-bold mt-3 mb-0">Expert Faculty</h3>
                                <p>A team of IITians guiding students since last 2 years</p>
                            </div>
                        </div>
                        <div className="feature">
                            <div>
                                <img className="border-circle" src="/images/test.png" />
                            </div>
                            <div>
                                <h3 className="mt-bold mt-3 mb-0">Our Test Series</h3>
                                <p>Join our Test Series and enhance your potential</p>
                            </div>
                        </div>
                        <div className="feature">
                            <div>
                                <img className="border-circle" src="/images/lecture.png" />
                            </div>
                            <div>
                                <h3 className="mt-bold mt-3 mb-0">Online Video Lectures</h3>
                                <p>Visit our YouTube channel New Era Online Coaching.</p>
                            </div>
                        </div>
                        <div className="feature">
                            <div>
                                <img className="border-circle" src="/images/star.png" />
                            </div>
                            <div>
                                <h3 className="mt-bold mt-3 mb-0">Awards</h3>
                                <p>Rewards for outstanding performers of our online tests</p>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="bg-grey py-4 py-md-5 px-2 text-center">
                    <h2 className="mt-bold">Popular Test Series</h2>
                    <div className="d-flex align-items-strech justify-content-center flex-wrap">
                        {exams && exams.map((exam, index) =>
                            <Link href={`/aits/?exam=${exam.slug}&name=${exam.name}`} key={index}>
                                <a className="feature feature-small item-shadow p-0">
                                    <div>
                                        <img src={exam.image} />
                                    </div>
                                    <div className="p-3">
                                        {exam.name}
                                    </div>
                                </a>
                            </Link>
                        )}
                        
                    </div>
                </div>
            </div>
            <style jsx>{`
                .bg-grey {
                    background: rgba(248,248,248,1);
                }
                .feature {
                    padding: 2rem;
                    margin: 1rem;
                    border-radius: 10px;
                    transition: 0.5s;
                    color: grey;
                    background: rgba(248,248,248,1);
                    cursor: pointer;
                    max-width: 360px;
                }
                .feature-small {
                    max-width: 260px;
                }
                .feature:hover {
                    background: white;
                    box-shadow: 0px 0px 30px 6px #ecf0f7;
                }
                .feature h3 {
                    color: rgba(0,0,0,0.8);
                }
                .border-circle {
                    border-radius: 50px !important;
                }
                .feature img {
                    border-radius: 10px 10px 0px 00px;
                    max-width: 100%;
                }
            `}</style>
        </Layout>
    )
}
