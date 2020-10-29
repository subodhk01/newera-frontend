import Head from 'next/head'
import Header from "./Header"

export default function Layout(props){
    return(
        <>
            <Head>
                <title>{props.title ? `${props.title} | NewEra Coaching Classes` : `NewEra Coaching Classes`}</title>
            </Head>
            <Header full={props.header && props.header.full} />
            <div className="outer-container">
                {props.children}
            </div>
            <style jsx>{`
                .outer-container {
                    padding-top: 89px;
                }
                @media(max-width: 992px){
                    .outer-container {
                        padding-top: 58px;
                    }
                }
            `}</style>
        </>
    )
}