import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { axiosInstance } from '../../utils/axios'
import Modal from 'react-modal'
import { customStyles2 } from '../../utils/constants'
import { CgCloseO } from 'react-icons/cg'
import { useAuth } from '../../utils/auth'
import ReactPlayer from "react-player"

export default function Batch(props) {
    const router = useRouter()
    const { id } = router.query

    const { profile } = useAuth()
    const [ infoOpen, setInfoOpen ] = React.useState(false)
    const [ batches, setBatches ] = React.useState()
    const [ activeBatch, setActiveBatch ] = React.useState()

    const [ paymentModal, setPaymentModal ] = React.useState(false)
    const [ successModal, setSuccessModal ] = React.useState(false)
    const [ paymentLoading, setPaymentLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")

    React.useEffect(() => {
        if(id){
            axiosInstance.get(`/batch/${id}`)
            .then((response) => {
                console.log("batch: ", response.data)
                setActiveBatch(response.data)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })
        }
    }, [id])

    async function verifySignature(response, amount) {
        setPaymentLoading(true)
        console.log("Payload for verify signature : ", response)
        //console.log("orderId: ", orderId)
        axiosInstance.post('/payments/', {
                transaction_id: response.razorpay_payment_id,
                amount: amount,
                student: profile.id,
                batch: activeBatch.id,
            })
            .then((res) => {
                console.log("PAYMENT RESPONSE", res)
                if (res.status == 201) {
                    //setPaymentLoading(false)
                    console.log("payment success")
                    setPaymentLoading(false)
                    setPaymentModal(false)
                    setSuccessModal(true)
                    setError("")
                } else {
                    setPaymentLoading(false)
                    setError("Unable to process your request try again, if your account has been deducted email us at...")
                }
            })
            .catch((error) => {
                console.log("error: ", error)
                console.log("response: ", error.response)
                setPaymentLoading(false)
                if(error.response && error.response.status === 400 && error.response.data.batch && error.response.data.batch.length && error.response.data.batch[0] === "You have already made a payment"){
                    setError("You have already made a payment")
                    return
                }
                setError("Unable to process your request try again, if your account has been deducted email us at...")
            })
    }

    async function makePayment(totalAmount, notes) {
        setError("")
        if(totalAmount === 0){
            console.log("free batch")
            setPaymentLoading(true)
            axiosInstance.post('/payments/batch/free/', {
                batch: activeBatch.id,
            })
            .then((res) => {
                console.log("free batch register res: ", res.data)
                if(res.data.success){
                    console.log("batch register success")
                    setPaymentLoading(false)
                    setPaymentModal(false)
                    setSuccessModal(true)
                    setError("")
                }
                else {
                    setPaymentLoading(false)
                    setError("Unable to process your request try again")
                }
            })
            .catch((error) => {
                console.log("error: ", error)
                console.log("response: ", error.response)
                setPaymentLoading(false)
                if(error.response && error.response.data.detail && error.response.data.detail === "Authentication credentials were not provided."){
                    setError("You must be logged in to register for any Batch")
                    return
                }
                if(error.response && error.response.status === 400 && error.response.data.batch && error.response.data.batch.length && error.response.data.batch[0] === "You have already made a payment"){
                    setError("You have already made a payment")
                    return
                }
                setError("Unable to process your request try again")
            })
        }else {
            var options = {
                key: "rzp_live_F1Vw65uKGuHD0F",
                amount: totalAmount * 100,
                name: "Newera Coaching",
                currency: "INR",
                description: "Batch Purchase",
                //image: "/images/logos/icon.png",
                handler: (response) => {
                    verifySignature(response, totalAmount);
                },
                prefill: {
                    name: profile.name,
                    email: profile.email
                },
                notes: notes,
                theme: {
                    color: "#027ff7"
                }
            }
            var rzp1 = new Razorpay(options)
            rzp1.open()
        }
        
    }

    const handleCoinPayment = () => {
        setPaymentLoading(true)
        setError()
        axiosInstance.post('/payments/withcoins/', {
                batch: id,
            })
            .then((res) => {
                console.log("PAYMENT RESPONSE: ", res.data)
                if(res.data.success){
                    //setPaymentLoading(false)
                    console.log("payment success")
                    setPaymentLoading(false)
                    setSuccessModal(true)
                }
                if(res.data.error){
                    setPaymentLoading(false)
                    setError(res.data.error)
                }
            })
            .catch((error) => {
                console.log("error: ", error)
                setPaymentLoading(false)
                if(error.response && error.response.status === 400 && error.response.data.test_series && error.response.data.test_series.length && error.response.data.test_series[0] === "You have already made a payment"){
                    setError("You have already made a payment")
                    return
                }
                setError("Unable to process your request try again")
            })
    }

    return (            
            <div className="">
                <Modal
                    isOpen={infoOpen}
                    onRequestClose={() => setInfoOpen(false)}
                    style={customStyles2}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    shouldCloseOnOverlayClick={true}
                    className="modal-container"
                >
                    <div className="text-center">
                        {activeBatch &&
                            <div className="p-3 p-md-5">
                                <h5 className="text-muted mt-bold">{activeBatch.name}</h5>
                                <div className="font-12 mt-bold text-right">
                                    {activeBatch.free || activeBatch.price === 0 ?
                                            <div className="text-success">Free</div>
                                        :
                                            <div className="d-flex align-items-center">
                                                {activeBatch.mrp && <div className="font-08 mt-normal text-muted text-line">&#8377;{activeBatch.mrp}</div>}&nbsp;&#8377;{activeBatch.price}
                                            </div>
                                        }
                                </div>
                                <hr />
                                <div>
                                    {activeBatch.description}
                                </div>
                                <div className="d-flex align-items-center justify-content-center pt-3">
                                    {activeBatch.pdf_description && 
                                        <a className="btn btn-info font-09" href={activeBatch.pdf_description} download>
                                            Download Info PDF
                                        </a>
                                    }
                                    {activeBatch.students.includes(profile.id) ?
                                        <div className="text-success">Registered</div>
                                        :
                                        profile && profile.id ?
                                            <>
                                                <div>
                                                    {error && <div className="text-danger p-1 pt-4">{error}</div>}
                                                </div>
                                                {paymentLoading ?
                                                    <div>Processing your payment, please wait...</div>
                                                    :
                                                    <>
                                                        <div className="btn btn-info font-11 px-5" onClick={() => handleCoinPayment()}>
                                                            Register with {activeBatch.coin_price} coins
                                                        </div>
                                                        <div className="btn btn-success font-09" onClick={() => setPaymentModal(true)}>
                                                            Register
                                                        </div>
                                                    </>
                                                }
                                            </> 
                                            :
                                            <span className="text-info">You must login to register for this batch</span> 
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className="position-absolute d-flex align-items-center justify-content-center image-modal cursor-pointer" onClick={() => setInfoOpen(false)}>
                        <CgCloseO size="25" />
                    </div>
                </Modal>
                <Modal
                    isOpen={paymentModal}
                    onRequestClose={() => setPaymentModal(false)}
                    style={customStyles2}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    shouldCloseOnOverlayClick={false}
                >
                    {activeBatch &&
                        <div className="text-center">
                            {paymentLoading ?
                                <div>Processing your payment, please wait...</div>
                                :
                                <>
                                    <p>Confirm payment of &#8377;{activeBatch.price}</p>
                                    <div className="btn btn-success" onClick={() => makePayment(activeBatch.price)}>
                                        Confirm
                                    </div>
                                    <div className="btn btn-danger" onClick={() => setPaymentModal(false)}>
                                        Cancel
                                    </div>
                                </>
                            }
                            <div>
                                {error && <div className="text-danger p-1 pt-4">{error}</div>}
                            </div>
                        </div>
                    }
                </Modal>
                <Modal
                    isOpen={successModal}
                    onRequestClose={() => setSuccessModal(false)}
                    style={customStyles2}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    shouldCloseOnOverlayClick={false}
                >
                    {activeBatch &&
                        <div>
                            Registered for <strong>{activeBatch.name}</strong> successfully, <Link href="/dashboard"><a>click here</a></Link> to go to Dashboard.
                        </div>
                    }
                </Modal>
                <div className="bg-grey py-4 py-md-5 px-2 text-center">
                {activeBatch &&
                <>
                     <div className="">
                        <h1 className="text-muted">{activeBatch.name}</h1>
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="btn btn-info font-09" onClick={() => {setActiveBatch(activeBatch); setInfoOpen(true)}}>
                                Info
                            </div>
                            {activeBatch.students.includes(profile.id) ?
                                <div className="text-success">Registered</div>
                                :
                                profile && profile.id ?
                                    <>
                                        <div>
                                            {error && <div className="text-danger p-1 pt-4">{error}</div>}
                                        </div>
                                        {paymentLoading ?
                                            <div>Processing your payment, please wait...</div>
                                            :
                                            <>
                                                <div className="btn btn-info font-11 px-5" onClick={() => handleCoinPayment()}>
                                                    Register with {activeBatch.coin_price} coins
                                                </div>
                                                <div className="btn btn-success font-09" onClick={() => {setActiveBatch(activeBatch); setPaymentModal(true)}}>
                                                    Register
                                                </div>
                                            </>
                                        }
                                    </>  
                                    :
                                    <span className="text-info" style={{ maxWidth: "150px" }}>You must login to register for this batch</span>  
                            }
                        </div>
                        {activeBatch.group_link && <div className="py-3 text-center">
                            Join the group using the following link<br />
                            <a href={activeBatch.group_link} target="_blank">{activeBatch.group_link}</a>
                        </div>}
                        <div className="py-3 text-left d-table mx-auto">
                            {activeBatch.testseries && activeBatch.testseries.length ?
                                <div>
                                    <h4>Test Series:</h4>
                                    <div className="d-flex">
                                        {activeBatch.testseries.map((item, index) => 
                                            <div className="item-shadow p-2 py-3 m-3 cursor-pointer border text-center" key={index}>
                                                {item.banner && <img src={item.banner} style={{ maxWidth: "270px", borderRadius: "20px" }} />}
                                                <h4>{item.name}</h4>
                                                <Link href={`/testseries/${item.id}`} key={index}>
                                                    <div className="btn btn-info">
                                                        Open
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }
                            {activeBatch.lectureseries && activeBatch.lectureseries.length ?
                                <div>
                                    <h4>Lecture Series:</h4>
                                    <div className="d-flex">
                                        {activeBatch.lectureseries.map((item, index) => 
                                            <div className="item-shadow p-2 py-3 m-3 cursor-pointer border text-center" key={index}>
                                                {item.banner && <img src={item.banner} style={{ maxWidth: "270px", borderRadius: "20px" }} />}
                                                <h4>{item.name}</h4>
                                                <Link href={`/lectureseries/${item.id}`} key={index}>
                                                    <div className="btn btn-info">
                                                        Open
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }
                            {activeBatch.studymaterials && activeBatch.studymaterials.length ? 
                                <div>
                                    <h4>Study Materials:</h4>
                                    <div className="d-flex">
                                        {activeBatch.studymaterials.map((item, index) => 
                                            <div className="item-shadow p-2 py-3 m-3 cursor-pointer border text-center" key={index}>
                                                {item.banner && <img src={item.banner} style={{ maxWidth: "270px", borderRadius: "20px" }} />}
                                                <h4>{item.name}</h4>
                                                <Link href={`/studymaterials/${item.id}`} key={index}>
                                                    <div className="btn btn-info">
                                                        Open
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }
                            {activeBatch.channels && activeBatch.channels.length ? 
                                <div>
                                    <h4>Channels:</h4>
                                    <div className="d-flex">
                                        {activeBatch.channels.map((item, index) => 
                                            <div className="item-shadow p-2 py-3 m-3 cursor-pointer border text-center" key={index}>
                                                {item.banner && <img src={item.banner} style={{ maxWidth: "270px", borderRadius: "20px" }} />}
                                                <h4>{item.name}</h4>
                                                <Link href={`/channels/${item.id}`} key={index}>
                                                    <div className="btn btn-info">
                                                        Open
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                        <div className="d-inline-block mx-auto py-4">
                            <ReactPlayer url={activeBatch.video_description} style={{ maxWidth: "90vw" }} />
                        </div>
                    </div>
                    </>
                }
                </div>
                <style jsx>{`
                    .image-modal {
                        top: 20px;
                        right: 20px;
                        background: white;
                        box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
                        height: 30px;
                        width: 30px;
                        border-radius: 50px;
                    }
                `}</style>
            </div>
    )
}
