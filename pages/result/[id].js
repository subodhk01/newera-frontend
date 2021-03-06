import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import AuthHOC from '../../components/AuthHOC'
import SideBarLayout from '../../components/UI/WithSideBar'
import randomColor from 'randomcolor'

import { Bar, Pie } from "react-chartjs-2";
import { Alert } from 'antd'

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
    const [ data3, setData3 ] = React.useState()
    const [ sectionWise, setSectionWise ] = React.useState()
    
    React.useEffect(() => {
        if(id){
            props.setHeader(true)
            axiosInstance.get(`results/${id}`).then((response) => {
                console.log("result: ", response.data)
                setResult(response.data)
                setTest(response.data && response.data.test)
                let topic_wise_keys = []
                let topic_wise_marks = []
                if(response.data.result && response.data.result.topic_wise_marks){
                    response.data.result.topic_wise_marks.map(item => {
                        Object.keys(item).map(topic => {
                            topic_wise_keys.push(topic)
                            topic_wise_marks.push(item[topic])
                        })
                    })
                }
                console.log(topic_wise_keys, topic_wise_marks)
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
                const colorArray = randomColor({
                    count: topic_wise_keys.length
                })
                const chartData3 = {
                    labels: topic_wise_keys,
                    datasets: [{
                        data: topic_wise_marks,
                        backgroundColor: colorArray,
                        hoverBackgroundColor: colorArray
                    }]
                };
                let newSectionWise = []
                for(var i=0; i<response.data.marks.section_wise.length; i++){
                    newSectionWise.push({
                        section: response.data.test.sections[i],
                        data: {
                            labels: ["Your Marks", "Average", "Highest"],
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
                                    data: [response.data.marks.section_wise[i], response.data.test.stats.average.section_wise[i], response.data.test.stats.highest.section_wise[i]]
                                }
                            ]
                        }
                    })
                }
                setData1(chartData1)
                setData2(chartData2)
                setData3(chartData3)
                setSectionWise(newSectionWise)
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
                            {test.status > 1 || test.instant_result ?
                                <>
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
                                            <div className="col-12 col-lg-4 p-2 mb-4">
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
                                        <div className="col-12 col-lg-4 p-2 mb-4">
                                            <h6>Compair with others</h6>
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
                                                    maintainAspectRatio: true,
                                                    // aspectRatio: 0.5
                                                }}
                                                height={300}
                                            />
                                        </div>
                                        <div className="col-12 col-lg-4 p-2 mb-4">
                                            <h6>Subject wise marks</h6>
                                            <Bar
                                                data={data2}
                                                height={300}
                                                options={{
                                                    maintainAspectRatio: true
                                                }}
                                            />
                                        </div>
                                        {sectionWise && sectionWise.map((item, index) =>
                                            <div className="col-12 col-lg-4 p-2 mb-4" key={index}>
                                                <h6>{item.section}</h6>
                                                <Bar
                                                    data={item.data}
                                                    height={300}
                                                    options={{
                                                        maintainAspectRatio: true
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="col-12 col-lg-8 p-2 mb-4">
                                            <h6>Topic wise marks</h6>
                                            <Pie 
                                                data={data3} 
                                                options={{
                                                    legend: {
                                                        display: false
                                                    },
                                                    // tooltips: {
                                                    //     callbacks: {
                                                    //         label: function (tooltipItem) {
                                                    //             console.log(tooltipItem)
                                                    //             return tooltipItem.yLabel;
                                                    //         }
                                                    //     }
                                                    // }
                                                }} 
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="pt-3">
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
                                    </div> */}
                                </>
                            :
                                <div className="text-center">
                                    <Alert description="Results will be available once test ends" />
                                    <div className="mt-2">
                                        <Link href="/tests">
                                            <a className="btn btn-success">
                                                Go to My Tests
                                            </a>
                                        </Link>
                                        
                                    </div>
                                </div>
                            }
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