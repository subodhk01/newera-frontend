import Footer from "../components/UI/Footer";

export default function TandC() {
    return (
        <div className="pt-5 mt-5">
        <div className="py-5 mt-5 container">
    <h3>Refund Policy</h3><br />
    <p lang="en-US">
        <h5>Refund &amp; Cancellation</h5>
    </p>
    <ul>
        <li>In case of any technical issue found in online fee payment, such as:<br />
            <ol>
                <li lang="en-US">During the online payment through credit/debit card if the payment gets debited and
                    the internet goes down due to some external server malfunction or any other similar happening.
                </li>
                <li lang="en-US">The system fails to generate the required acknowledgment due to internet
                    malfunction.</li>
                <li lang="en-US">The payment gets deducted from the payer's account and does not reach the
                    institute's account or payment gets debited twice due to server error.</li>
            </ol>
        </li>
        <li lang="en-US">We shall not be responsible in any case until the course fee paid by student or parent is
            credited in to the Bank Account of the institute.</li>
        <li>Your purchase of any product or service on this website is entirely at your own risk, for
            which we shall not be liable. It shall be your own responsibility to ensure that any products, services
            available through this website meet your specific requirements.</li>
        <li>
            All subscription available on website or app are non refundable without any exception
        </li>
    </ul>
</div>
        <Footer />
        </div>
    )
}