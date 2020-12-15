import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import AuthHOC from '../../components/AuthHOC'
import SideBarLayout from '../../components/UI/WithSideBar'

import { Bar } from "react-chartjs-2";

// import dynamic from 'next/dynamic'

// const axiosInstance = dynamic(() =>
//   import('../../utils/axios').then((mod) => mod.axiosInstance),
//   {ssr: false}
// )

export default function Test(props){  
    const router = useRouter()
    const { id } = router.query

    const [ loading, setLoading ] = React.useState(true)
    const [ result, setResult ] = React.useState()
    const [ test, setTest ] = React.useState()
    const [ data1, setData1 ] = React.useState()
    const [ data2, setData2 ] = React.useState()
    
    React.useEffect(() => {
        if(id){
            props.setHeader(true)
            axiosInstance.get(`results/${id}`).then((response) => {
                console.log("result: ", response.data)
                setResult(response.data)
                setTest(response.data && response.data.test)
                const chartData1 = {
                    labels: ["You", "Average", "Highest"],
                    datasets: [
                        {
                            label: "Marks",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: "butt",
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: "miter",
                            data: [response.data.marks.total, response.data.test.stats.average.overall, response.data.test.stats.highest.overall ]
                        }
                    ]
                }
                const chartData2 = {
                    labels: response.data.test.sections,
                    datasets: [
                        {
                            label: "Marks",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: "butt",
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: "miter",
                            data: response.data.marks.section_wise
                        }
                    ]
                }
                setData1(chartData1)
                setData2(chartData2)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [id])

    return(
        <AuthHOC>
            <SideBarLayout title="Result">
                <div className="p-2 p-md-5">
                    {!loading &&
                        <>
                            <div>
                                <h2>Result Analysis {result.practice && <span className="text-warning">Practice Attempt</span>}</h2>
                            </div>
                            <div className="py-3 d-flex align-items-center justify-content-end">
                                <Link href={`/test/review/${id}`}>
                                    <a>
                                        <div className="btn btn-info">
                                            Question Wise Review
                                        </div>
                                    </a>
                                </Link>
                            </div>
                            <div className="row no-gutters">
                                <div className="col-12 col-md-6">
                                    <div>
                                        Test Name: {test.name}
                                    </div>
                                    <div>
                                        Start Time: {new Date(result.checkin_time).toLocaleString()}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <h2>Marks Obtained: {result.marks && result.marks.total}/{result.marks && result.marks.max_marks && result.marks.max_marks[result.marks.max_marks.length - 1]}</h2>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center justify-content-center py-4">
                                {result.ranks && 
                                    <div className="">
                                        <h6>Ranks</h6>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Section</th>
                                                    <th>Ranks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {test.sections && test.sections.map((section, index) =>
                                                    <tr key={`sectionRow-${index}`}>
                                                        <td>{section}</td>
                                                        <td>{result && result.ranks && result.ranks.section_wise && result.ranks.section_wise[index]}</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td><strong>Overall</strong></td>
                                                    <td>{result && result.ranks && result.ranks.overall}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                }
                                <div className="col-12 col-lg-auto">
                                    <Bar
                                        data={data1}
                                        options={{
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        suggestedMin: 0,
                                                        suggestedMax: result.marks.max_marks[result.marks.max_marks.length - 1]
                                                    }
                                                }]
                                            },
                                            // maintainAspectRatio: false,
                                            // aspectRatio: 0.5
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-lg-auto">
                                    <Bar
                                        data={data2}
                                        // height="100%"
                                        // width="100%"
                                        // options={{
                                        //     maintainAspectRatio: false,
                                        //     aspectRatio: 0.5
                                        // }}
                                    />
                                </div>
                            </div>
                            <div className="pt-3">
                                <div className="row no-gutters">
                                    <div className="col-12 col-lg-5">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Question No.</th>
                                                    <th>Marks Obtained</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.result && result.result.question_wise_marks && result.result.question_wise_marks.map((item, index) => 
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{item.marks}</td>
                                                        <td>{item.status}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12 col-lg-7">
                                        
                                    </div>
                                </div>
                            </div>
                        </>
                    }
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