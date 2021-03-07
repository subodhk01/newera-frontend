export default function ChatBox(props){
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
                                            {msg.message}
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
            <div className="input-container p-3 d-flex flex-shrink-1">
                <div className="flex-grow-1 px-3">
                    <input value={props.message} onChange={(event) => props.setMessage(event.target.value)} placeholder="Enter message here" className="form-control chat-input" />
                </div>
                <div className="flex-shrink-1">
                    <button className="btn btn-success" onClick={props.handleMessageSend} disabled={!props.message}>Send</button>
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