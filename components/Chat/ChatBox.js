import React from 'react'
import { GrDocumentPdf } from 'react-icons/gr'
import { BiImageAdd } from 'react-icons/bi'


import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { baseURL } from '../../utils/axios';
import axios from 'axios'

// Register the plugin
registerPlugin(FilePondPluginImagePreview);

export default function ChatBox(props){
    const [ functions, setFunctions ] = React.useState({})
    // const [ file, setFile ] = React.useState()
    const filePondRef = React.useRef(null)
    React.useEffect(() => {
        if(props.active){
            setFunctions({
                msg: props.setMessage,
                image: props.setImage,
                pdf: props.setPdf
            })
        }
    }, [])
    return(
        <div className="d-flex flex-column h-100 mx-auto" style={{ maxWidth: "800px" }}>
            <div className="flex-grow-1 w-100 p-3 p-md-4 mx-auto position-relative" >
                {props.loading ?
                    <div className="text-center">
                        Loading...
                    </div>
                    :
                    <>
                        <div className="chat-container" style={{ height: "100%", maxWidth: "800px", overflow: "scroll" }}>
                            <div className="msg-container">
                                {props.messages.length === 0 && <div className="text-muted text-center">No Messages</div>}
                                {props.messages && props.messages.map((msg, index) => 
                                    <div className={`msg-box-container position-relative ${msg.student && msg.student.id === props.profile.id && "ml-auto"}`}>
                                        {msg.student &&
                                            <>
                                                {!(msg.student.id === props.profile.id) &&
                                                    <div className="text-muted">{msg.student.name}</div>
                                                }
                                            </>
                                        }
                                        {msg.teacher &&
                                            <div className="text-warning">{msg.teacher.name}</div>
                                        }

                                        <div className={`msg-box ${msg.student && msg.student.id === props.profile.id && "ml-auto my-msg"}`} key={msg.id}>
                                            {msg.message && msg.message}
                                            {msg.image && <img src={msg.image} style={{ maxWidth: "200px" }} />}
                                        </div>

                                        <div className="date-container text-muted">
                                            {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                )}
                                <div ref={props.bottomRef} className="list-bottom"></div>
                            </div>
                            
                        </div>
                    </>
                }
            </div>
            <div className="input-container p-3 d-flex flex-shrink-1 align-items-center">
                {props.active === "msg" &&
                    <div className="flex-grow-1 px-3">
                        <input value={props.message} onChange={(event) => props.setMessage(event.target.value)} placeholder="Enter message here" className="form-control chat-input" />
                    </div>
                }
                {(props.active === "image" || props.active === "pdf") &&
                    <div className="flex-grow-1">
                        <FilePond
                            ref={filePondRef}
                            // files={file}
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
                                        console.log(props.active, functions[props.active])
                                        functions[props.active](response.data.url)
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
                                    console.log(functions)
                                    console.log(props.active, functions[props.active])
                                    functions[props.active]()
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
                                    console.log(functions)
                                    console.log(props.active, functions[props.active])
                                    functions[props.active]()
                                    console.log("remove called")
                                }
                            }}

                            labelIdle={`Drag & Drop your ${props.active} file or <span class="filepond--label-action">Browse</span>`}
                        />
                    </div>
                }
                {props.active != "pdf" &&
                    <div className="flex-shrink-1">
                        <button className="btn btn-warning" onClick={() => props.setActive("pdf")}><GrDocumentPdf color="white" /></button>
                    </div>
                }
                {props.active != "image" && 
                    <div className="flex-shrink-1">
                        <button className="btn btn-warning" onClick={() => props.setActive("image")}><BiImageAdd size="20" /></button>
                    </div>
                }
                {props.active != "msg" && 
                    <div className="flex-shrink-1">
                        <button className="btn btn-warning" onClick={() => props.setActive("msg")}>Text</button>
                    </div>
                }
                <div className="flex-shrink-1">
                    <button className="btn btn-success" onClick={() => {props.handleMessageSend(); filePondRef.current.removeFiles()}} disabled={!props.message && !props.image && !props.pdf}>Send</button>
                </div>
            </div>
            <style jsx>{`
                .chat-container {
                    // position: relative;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
                .msg-container {
                    
                }
                .input-container {
                    
                }
                .msg-box-container {
                    margin: 5px 0px;
                    width: fit-content;
                }
                .msg-box {
                    padding: 0.7rem 1rem;
                    background: rgb(77 204 140 / 50%);
                    border-radius: 15px;
                    width: fit-content;
                }
                .date-container {
                    margin-left: auto;
                    width: fit-content;
                    position: relative;
                    right: 0px;
                    top: -5px;
                    background: white;
                    font-size: 0.7rem;
                    border: 1px solid silver;
                    border-radius: 50px;
                    padding: 0.1rem 0.6rem;
                }
                .my-msg {
                    background: rgb(97 173 241 / 50%);
                }
            `}</style>
        </div>
    )
}