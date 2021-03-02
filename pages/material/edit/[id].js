import React from 'react'
import axios from 'axios'
import { axiosInstance, baseURL } from '../../../utils/axios'
import Router, { useRouter } from 'next/router'
import TestHeader from '../../../components/UI/TestHeader'

import { Checkbox } from 'antd';

import { FilePond } from 'react-filepond'
import AuthHOC from '../../../components/AuthHOC'
import { useAuth } from '../../../utils/auth'


function createMarkup(data) {
    return {__html: data};
}

export default function MaterialCreate(props){  
    const router = useRouter()
    const { id } = router.query
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ questionLoading, setQuestionLoading ] = React.useState(false)
    const [ title, setTitle ] = React.useState("")
    const [ files, setFiles ] = React.useState([])
    const [ material, setMaterial ] = React.useState()
    const [ description, setDescription ] = React.useState("")
    const [ free, setFree ] = React.useState(false)
    const [ error, setError ] = React.useState("")

    React.useEffect(() => {
        props.setHeader(false)
        axiosInstance.get(`/materials/${id}/`)
            .then((response) => {
                console.log("material data: ", response.data)
                let data = response.data
                setTitle(data.title)
                setMaterial(data.material)
                setDescription(data.description)
                setFree(data.free)
                setLoading(false)
            })
            .catch((error) => {

            })
    }, [])

    const handleTestEdit = () => {
        setError("")
        console.log("files: ", files)
        console.log("free: ", free)
        console.log("materialTitle: ", title)
        console.log("material: ", material)
        if(!title){
            setError("Please fill all details")
            return
        }
        axiosInstance.patch(`/materials/${id}/`, {
            created_by: profile.id,
            title: title,
            material: material,
            description: description,
            free: free
        })
        .then((response) => {
            console.log("material update response: ", response.data)
            setError("Material successfully updated!")
        }).catch((error) => {
            console.log(error)
            console.log(error.response)
            setError(error && error.response && error.response.data || "Unexpected error, please try again")
        })
    }

    return(
        <AuthHOC teacher>
            { loading ?
                <div>
                    Loading...
                </div>
                :
                <>
                    <TestHeader testName={"Create Material"} />
                    <div className="row no-gutters pt-4">
                        <div className="col-12 col-lg-3 border-right px-2 py-4">
                            <div className="px-2 py-5 text-center">
                                <div>
                                    {error && typeof(error) === "string" && <span className="text-danger">{error}</span>}
                                    {error && typeof(error) === "object" && 
                                        Object.keys(error).map((key, index) => 
                                            <span key={index} className="text-danger">{key} : {error[key]}</span>
                                        )
                                    }
                                </div>
                                <div className="btn btn-success" onClick={handleTestEdit}>
                                    Update Material
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9">
                            {questionLoading ?
                                <div>
                                    Loading
                                </div> :
                                <>
                                    <div>
                                        <div className="w-75 mx-auto p-1 row no-gutters">
                                            <div className="col-12 p-2">
                                                Material Title: 
                                                <input type="text" name="materialTitle" className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} />
                                            </div>
                                            <div className="col-12 p-3">
                                                <div className="font-weight-bold mb-2">Material File:</div>
                                                {material && <div className="text-success">{material}</div>}
                                                <FilePond
                                                    //files={image}
                                                    allowMultiple={false}
                                                    name="filepond"
                                                    server={{
                                                        process: (fieldName, file, metadata, load, error, progress, abort) => {
                                                            const formData = new FormData()
                                                            formData.append('image', file, file.name)

                                                            // aborting the request
                                                            const CancelToken = axios.CancelToken
                                                            const source = CancelToken.source()

                                                            axios({
                                                                method: 'PUT',
                                                                url: `${baseURL}question/create`,
                                                                data: formData,
                                                                cancelToken: source.token,
                                                                onUploadProgress: (e) => {
                                                                    // updating progress indicator
                                                                    progress(e.lengthComputable, e.loaded, e.total)
                                                                }
                                                            }).then(response => {
                                                                // passing the file id to FilePond
                                                                load(response.file)
                                                                console.log(response.data.url)
                                                                setMaterial(response.data.url)
                                                            }).catch((thrown) => {
                                                                if (axios.isCancel(thrown)) {
                                                                    console.log('Request canceled', thrown.message)
                                                                } else {
                                                                    // handle error
                                                                }
                                                            })
                                                            // Setup abort interface
                                                            return {
                                                                abort: () => {
                                                                    source.cancel('Operation canceled by the user.')
                                                                    abort()
                                                                }
                                                            }
                                                        },
                                                        revert: (uniqueFileId, load, error) => {
                                                            setMaterial()
                                                            console.log("revert called")
                                                        },
                                                        load: (source, load, error, progress, abort, headers) => {
                                                            console.log("load called")
                                                        },
                                                        fetch: (url, load, error, progress, abort, headers) => {
                                                            console.log("fetch called")
                                                        },
                                                        restore: (uniqueFileId, load, error, progress, abort, headers) => {
                                                            console.log("restore called")
                                                        },
                                                        remove: (source, load, error) => {
                                                            setMaterial()
                                                            console.log("remove called")
                                                        }
                                                    }}

                                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                />
                                            </div>
                                            
                                            <div className="col-12 p-2">
                                                <label className="p-2 m-1 cursor-pointer">
                                                    <Checkbox checked={free} onChange={(event) => setFree(event.target.checked)}>Free</Checkbox>
                                                </label>
                                            </div>
                                            <div className="col-12 p-2">
                                                Description: 
                                                <textarea rows="3" type="text" name="description" className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </AuthHOC>
    )
}