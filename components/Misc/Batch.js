import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import Modal from 'react-modal'
import { customStyles2 } from '../../utils/constants'
import { CgCloseO } from 'react-icons/cg'
import { useAuth } from '../../utils/auth'

export default function Batch(props) {
    const { profile } = useAuth()
    const [ infoOpen, setInfoOpen ] = React.useState(false)
    const [ batches, setBatches ] = React.useState()
    const [ activeBatch, setActiveBatch ] = React.useState()

    const [ paymentModal, setPaymentModal ] = React.useState(false)
    const [ successModal, setSuccessModal ] = React.useState(false)
    const [ paymentLoading, setPaymentLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")

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
                if(error.response && error.response.status === 400 && error.response.data.batch && error.response.data.batch.length && error.response.data.batch[0] === "You have already made a payment"){
                    setError("You have already made a payment")
                    return
                }
                setError("Unable to process your request try again")
            })
        }else {
            var options = {
                key: "rzp_live_VMy6LTFP3FIQmO",
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
                                            <div>
                                            &#8377;{activeBatch.price}
                                            </div>
                                        }
                                </div>
                                <hr />
                                <div>
                                    {activeBatch.description}
                                </div>
                                <div className="d-flex align-items-center justify-content-center pt-3">
                                    <div className="btn btn-success font-09" onClick={() => setPaymentModal(true)}>
                                        Register
                                    </div>
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
                                    <div className="btn btn-info font-09" onClick={() => {setActiveBatch(batch); setInfoOpen(true)}}>
                                        Info
                                    </div>
                                    {batch.status === 4 ?
                                       <div className="text-success">Registered</div>
                                       :
                                       <div className="btn btn-success font-09" onClick={() => {setActiveBatch(batch); setPaymentModal(true)}}>
                                            Register
                                        </div> 
                                    }
                                    
                                </div>
                            </a>
                        )}
                        
                    </div>
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
