import React from 'react'
import Flickity from 'react-flickity-component'
import { axiosInstance } from '../../utils/axios'

const flickityOptions = {
    initialIndex: 2,
    wrapAround: true,
    //groupCells: 2,
    cellAlign: 'center',
    contain: true,
    //groupCells: false,
    autoPlay: 3500,
    //prevNextButtons: false,
    //pageDots: false,
    pauseAutoPlayOnHover: false,
    selectedAttraction: 0.013,
    friction: 0.3
}

export default function HomeBanners() {
    const [ banners, setBanners ] = React.useState()
    React.useEffect(() => {
        axiosInstance.get("/banners/list")
            .then((response) => {
                console.log("banner list: ", response.data)
                setBanners(response.data)
            }).catch((error) => {
                console.log(error)
            })
    }, [])
    return (
        <div className="">
            <Flickity
                className={'carousel'}
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate={true}
                static={false}
            >
                {banners && banners.map((item, index) =>
                    <div key={index} className="carousel-cell">
                        <img alt={item.alt} src={item.image} />
                    </div>
                )}
            </Flickity>
        </div>
    )
}