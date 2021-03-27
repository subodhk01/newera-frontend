import Link from 'next/link'
import { FaYoutube, FaFacebookSquare, FaInstagram } from 'react-icons/fa'

export default function Footer() {
    return (
        <div style={{ background: "rgba(0,0,0,0.06)" }} className="pb-3">
        <div className="container py-0 pt-5">
            <div className="row no-gutters">
                <div className="col-12 col-md-4">
                    <h4>About us</h4>
                    <p>We are the team of IITians & Medicose. We provide online/offline Coaching for IIT JEE(Main+Advanced)/NEET/NTSE/Olympiad/KVPY for class 9th, 10th, 11th, 12th and dropper students. Our learning platform was started in the year 2017. We have mentored more than 300,000 students and many of those students are studying in IITs/NITs/AIIMs/IISC and other similar college. We provide online/offline Classes, Live Classes, Recorded Lectures, Online Test Series, Study Material, Doubt Solving etc. to  the students.</p>
                </div>
                <div className="col-12 col-md-4 text-center">
                    <h4>Contact Us</h4>
                    <p>+917380736814</p>
                    <p>+919936237763</p>
                    <p>+917662359179</p>
                </div>
                <div className="col-12 col-md-4">
                    <h4>Email Us</h4>
                    <p>neweraonlinecoaching@gmail.com</p>
                    <p>mailto:info@neweraonlinecoaching.com</p>
                </div>
            </div>
            <div className="pt-5 d-flex align-items-center justify-content-between">
                <div>
                    <a href="https://www.youtube.com/neweraonlinecoaching" target="_blank" className="p-2"><FaYoutube size="25" color="#FF0000" /></a>
                    <a href="https://facebook.com/neweraonlinecoaching/" target="_blank" className="p-2"><FaFacebookSquare size="25" color="#4267B2" /></a>
                    <a href="https://www.instagram.com/neweracoachingrewa/" target="_blank" className="p-2"><FaInstagram size="25" color="#dd2a7b" /></a>
                </div>
                <div>
                    <Link href="/terms-and-conditions">
                        <a className="text-muted">
                            Terms and Conditions
                        </a>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    )
}