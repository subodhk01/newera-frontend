import React from 'react'
import SideBarLayout from '../components/UI/WithSideBar'
import StudentVideoTable from '../components/Tables/Video/StudentVideoTable'
import TeacherVideoTable from '../components/Tables/Video/TeacherVideoTable'
import { useAuth } from '../utils/auth'
import { axiosInstance, baseURL } from '../utils/axios'
import axios from 'axios'
import { customStyles2 } from '../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../components/AuthHOC'
import { FaHockeyPuck, FaWindowRestore } from 'react-icons/fa'
import Link from 'next/link'
import { Alert } from 'antd'

import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Register the plugin
registerPlugin(FilePondPluginImagePreview);



export default function Tests(props){
    const [ image, setImage ] = React.useState()

    const handleUpload = () => {
        console.log("upload: ", image)
    }
    return(
        <AuthHOC teacher>
            <SideBarLayout title="Image Upload">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>Image upload</h1>
                    </div>
                    {image && <div className="">{image}</div>}
                    <div>
                        <div className="p-3">
                            <div className="font-weight-bold mb-2">Image:</div>
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
                                            setImage(response.data.url)
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
                                        setImage()
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
                                        setImage()
                                        console.log("remove called")
                                    }
                                }}

                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                    </div>
                </div>
            </SideBarLayout>
        </AuthHOC>
    )
}