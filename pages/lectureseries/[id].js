import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import { customStyles2 } from '../../utils/constants'
import { useRouter } from 'next/router'
import AuthHOC from '../../components/AuthHOC'
import SideBarLayout from '../../components/UI/WithSideBar'
import Modal from 'react-modal'
import VideoThumbnail from 'react-video-thumbnail'
import ReactPlayer from 'react-player'
//import QierPlayer from 'qier-player'
import { Player } from 'video-react'
import { useAuth } from '../../utils/auth'
import { Alert } from 'antd'

export default function Lectureseries(props){  
    const router = useRouter()
    const { id } = router.query

    const { profile } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ paymentModal, setPaymentModal ] = React.useState(false)
    const [ paymentLoading, setPaymentLoading ] = React.useState(false)
    const [ error, setError ] = React.useState("")
    const [ series, setSeries ] = React.useState()
    const [ isRegistered, setRegistered ] = React.useState(false)
    
    React.useEffect(() => {
        if(id){
            props.setHeader(true)
            axiosInstance.get(`lectureseries/${id}/`).then((response) => {
                console.log("series: ", response.data)
                let rawSeries = response.data
                rawSeries.videos = rawSeries.videos.sort((a,b) => (new Date(a.activation_time) - new Date(b.activation_time)))
                setSeries(rawSeries)
                if(response.data.registered_students.includes(profile.id) || response.data.price === 0 || response.data.free){
                    console.log("student is registered")
                    setRegistered(true)
                }
                setLoading(false)
            }).catch((error) => {
                console.log(error)
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
                lecture_series: id,
            })
            .then((res) => {
                console.log("PAYMENT RESPONSE", res)
                if (res.status == 201) {
                    //setPaymentLoading(false)
                    console.log("payment success")
                    setPaymentLoading(false)
                    setPaymentModal(false)
                    setRegistered(true)
                } else {
                    setPaymentLoading(false)
                    setError("Unable to process your request try again, if your account has been deducted email us at...")
                }
            })
            .catch((error) => {
                console.log("error: ", error)
                setPaymentLoading(false)
                if(error.response && error.response.status === 400 && error.response.data.lecture_series && error.response.data.lecture_series.length && error.response.data.lecture_series[0] === "You have already made a payment"){
                    setError("You have already made a payment")
                    return
                }
                setError("Unable to process your request try again, if your account has been deducted email us at...")
            })
    }

    async function makePayment(totalAmount, notes) {
        setError("")
        var options = {
            key: "rzp_live_VMy6LTFP3FIQmO",
            amount: totalAmount * 100,
            name: "Newera Coaching",
            currency: "INR",
            description: "Lecture Purchase",
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

    return(
        <AuthHOC>
            <SideBarLayout title="Videos">
                <div className="p-2 p-md-5">
                    {!loading &&
                        <>
                            <div>
                                <h1>{series.name}</h1>
                            </div>
                            <div className="py-4">
                                <Alert description="You can watch all our videos and streams only on our Mobile Application. You can download our application from Play Store." />
                            </div>
                            <div className="p-3 text-right">
                                {series.syllabus &&
                                    <a className="btn btn-success font-11 px-5" target="blank" href={series.syllabus}>
                                        Download Syllabus
                                    </a> 
                                }
                                {isRegistered ?
                                    <div></div>
                                    :
                                    <div className="btn btn-info font-11 px-5" onClick={() => setPaymentModal(true)}>
                                        Buy Now &#8377;{series.price}
                                    </div>    
                                }
                                {profile.is_teacher && 
                                    <Link href={`/lectureseries/edit/${series.id}`}>
                                        <a>
                                            <div className="btn btn-warning font-11 px-5">
                                                Edit Lecture Series
                                            </div>
                                        </a>
                                    </Link>
                                }
                            </div>
                            <Modal
                                isOpen={paymentModal}
                                onRequestClose={() => setPaymentModal(false)}
                                style={customStyles2}
                                contentLabel="Example Modal"
                                ariaHideApp={false}
                                shouldCloseOnOverlayClick={false}
                            >
                                <div className="text-center">
                                    {paymentLoading ?
                                        <div>Processing your payment, please wait...</div>
                                        :
                                        <>
                                            <p>Confirm payment of &#8377;{series.price}</p>
                                            <div className="btn btn-success" onClick={() => makePayment(series.price)}>
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
                            </Modal>
                            <div className="pt-3">
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    {series && series.videos && series.videos.map((video, index) =>
                                        <>
                                            {isRegistered || video.free || profile.is_teacher ?
                                                <div className="item-shadow p-3 py-4 m-3 cursor-pointer border text-center" key={index}>
                                                    <h5>{video.title}</h5>
                                                    <hr />
                                                    <img src={video.thumbnail} />
                                                    <div>
                                                        {profile.is_teacher ?
                                                            <>
                                                                <Link href={`/video/edit/${video.id}`}>
                                                                    <a>
                                                                        <div className="btn btn-warning">
                                                                            Edit Video
                                                                        </div>
                                                                    </a>
                                                                </Link>
                                                                {/* <div className="btn btn-danger">
                                                                    Remove Test
                                                                </div> */}
                                                            </>
                                                            :
                                                            <div></div>
                                                        }
                                                    </div>
                                                </div>
                                            :
                                                <div className="item-shadow dark p-3 py-4 m-3 cursor-pointer border text-center position-relative" key={index}>
                                                    <h5 className="text-white">{video.title}</h5>
                                                    <hr />
                                                    <img src={`https://img.youtube.com/vi/${video.url.split('v=')[1]}/default.jpg`} />
                                                    <br/>
                                                    <div>
                                                        <div className="btn btn-warning" onClick={() => setPaymentModal(true)}>
                                                            BUY
                                                        </div>
                                                    </div>
                                                    <div className="lock-icon-box">
                                                        <img src="/lock.svg" />
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    }
                </div>
                <style jsx>{`
                    .item-shadow {
                        color: grey;
                        min-width: 300px;
                    }
                    .dark {
                        color: white;
                        background-color: rgba(0,0,0,0.6);
                        border: 1px solid black;
                    }
                    .lock-icon-box {
                        position: absolute;
                        top: -13px;
                        right: -13px;
                    }
                    .lock-icon-box img {
                        width: 40px;
                    }
                    img {
                        max-width: 230px;
                    }
                `}</style>
            </SideBarLayout>
        </AuthHOC>
    )
}

function VideoPlayer(props) {
    const { videoSrc } = props;
    const playerRef = React.useRef();

    React.useEffect(() => {
        const player = videojs(playerRef.current, { autoplay: true, muted: true }, () => {
            player.src(videoSrc);
        });

        return () => {
            player.dispose();
        };
    }, []);

    return (
        <div data-vjs-player>
            <video ref={playerRef} className="video-js vjs-16-9" playsInline />
        </div>
    );
}