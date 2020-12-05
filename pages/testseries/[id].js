import React from 'react'
import Link from 'next/link'
import { axiosInstance } from '../../utils/axios'
import { useRouter } from 'next/router'
import AuthHOC from '../../components/AuthHOC'
import SideBarLayout from '../../components/UI/WithSideBar'
import VideoThumbnail from 'react-video-thumbnail'
import ReactPlayer from 'react-player'
//import QierPlayer from 'qier-player';
import { Player } from 'video-react';

// import dynamic from 'next/dynamic'

// const axiosInstance = dynamic(() =>
//   import('../../utils/axios').then((mod) => mod.axiosInstance),
//   {ssr: false}
// )

function createMarkup(data) {
    return {__html: data};
}

export default function TestSeries(props){  
    const router = useRouter()
    const { id } = router.query

    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    
    React.useEffect(() => {
        if(id){
            axiosInstance.get(`testseries/${id}/`).then((response) => {
                console.log("series: ", response.data)
                setSeries(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [id])

    return(
        <AuthHOC>
            <SideBarLayout title="Tests">
                <div className="p-2 p-md-5">
                    {!loading &&
                        <>
                            <div>
                                <h1>{series.name}</h1>
                            </div>
                            <div className="p-3">
                                <div className="btn btn-info font-11 px-5">
                                    Buy Now
                                </div>
                            </div>
                            <div className="pt-3">
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    {series && series.tests && series.tests.map((test, index) =>
                                        <>
                                            {test.free ?
                                                <div className="item-shadow p-3 py-4 m-3 cursor-pointer border text-center" key={index}>
                                                    <h5>{test.name}</h5>
                                                    <hr />
                                                    <div className="text-right">
                                                        BUY
                                                    </div>
                                                    <div>
                                                        <Link href={`/test/attempt/${test.id}`}>
                                                            <a>
                                                                <div className="btn btn-success">
                                                                    Attempt Test
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            :
                                                <div className="item-shadow dark p-3 py-4 m-3 cursor-pointer border text-center position-relative" key={index}>
                                                    <h5 className="text-white">{test.name}</h5>
                                                    <hr />
                                                    <div className="text-right">
                                                        BUY
                                                    </div>
                                                    <div>
                                                        <div className="btn btn-warning">
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