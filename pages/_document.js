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
                    <link rel="icon" href="/images/logos/icon.png" type="image/png" />
                    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                </Head>
                <body style={{ minHeight: "100vh" }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument