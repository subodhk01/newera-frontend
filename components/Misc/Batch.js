import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'

export default function Batch(props) {
    const [ batches, setBatches ] = React.useState()

    React.useEffect(() => {
        axiosInstance.get("/batch/list")
            .then((response) => {
                console.log("batches: ", response.data)
                setBatches(response.data)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
    }, [])

    return (            
            <div className="">
                <div className="bg-grey py-4 py-md-5 px-2 text-center">
                    <h2 className="mt-bold">Batches</h2>
                    <div className="d-flex align-items-strech justify-content-center flex-wrap">
                        {batches && batches.map((batch, index) =>
                            <a className="feature feature-big item-shadow p-3 m-2" key={index}>
                                <h5 className="text-muted">{batch.name}</h5>
                                <div className="font-12 mt-bold text-right">
                                    {batch.free || batch.price === 0 ?
                                            <div className="text-success">Free</div>
                                        :
                                            <div>
                                                &#8377;{batch.price}
                                            </div>
                                        }
                                </div>
                                <hr />
                                <div className="d-flex align-items-center justify-content-center">
                                    <Link href={`/batch/${batch.id}`}>
                                        <a>
                                            <div className="btn btn-info font-09">
                                                Info
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </a>
                        )}
                        
                    </div>
                </div>
            </div>
    )
}
