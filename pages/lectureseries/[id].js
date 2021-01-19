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

export default function LectureSeries(props){  
    const router = useRouter()
    const { id } = router.query

    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    
    React.useEffect(() => {
        if(id){
            axiosInstance.get(`lectureseries/${id}/`).then((response) => {
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
                            <div className="pt-3">
                                <div className="d-flex flex-wrap align-items-center justify-content-center">
                                    {series && series.videos && series.videos.map((video, index) =>
                                            <div className="item-shadow p-3 m-3 cursor-pointer border" key={index}>
                                            {/* <VideoThumbnail
                                                videoUrl={video.url}
                                                thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                                                width={120}
                                                height={80}
                                                cors={true}
                                            /> */}
                                            {/* <video
                                                id="vid1"
                                                className="video-js vjs-default-skin"
                                                controls
                                                autoPlay
                                                width="640" height="264"
                                                data-setup={`{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${video.url}"}] }`}
                                            >
                                            </video> */}
                                            {/* <QierPlayer srcOrigin={video.url} /> */}
                                            <Player
                                                playsInline
                                                poster=""
                                                //src={video.url}
                                                
                                            />
                                                <source src={video.url} />
                                                <h6 className="m-0">{video.title}</h6>
                                                <hr />
                                                {video.description}
                                            </div>
                                    )}
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