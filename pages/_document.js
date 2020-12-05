import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="description" content=""></meta>
                    <meta name="keywords" content=""></meta>
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                    <link rel="icon" href="/images/logos/icon.png" type="image/png" />
                    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <script src="/js/video.min.js"></script>
                    <script src="/js/youtube.min.js"></script>
                </body>
            </Html>
        )
    }
}

export default MyDocument