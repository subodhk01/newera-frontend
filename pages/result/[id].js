import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import AuthHOC from '../../components/AuthHOC'
import SideBarLayout from '../../components/UI/WithSideBar'

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
    
    React.useEffect(() => {
        if(id){
            axiosInstance.get(`results/${id}`).then((response) => {
                console.log("result: ", response.data)
                setResult(response.data)
                setTest(response.data && response.data.test)
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