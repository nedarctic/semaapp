import Link from 'next/link';
import { FaFacebook, FaXTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";

export function Footer() {

    return (
        <footer className="flex flex-col items-center md:items-start md:h-80 w-full bg-white dark:bg-black p-4">
            <div className="flex flex-col items-center justify-center dark:bg-white bg-black rounded-2xl  h-full w-full p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start">

                    <div className="flex flex-col w-full md:w-1/3 h-full bg-black dark:bg-white items-start justify-start overflow-hidden p-6">

                        {/* logo */}
                        <p className="text-white dark:text-black text-xl font-bold pb-2">SemaFacts</p>

                        {/* description */}
                        <p className="text-white dark:text-black text-md font-medium pb-4">Whistleblowing management platform</p>

                        {/* social icons */}
                        <div className="flex items-center justify-start space-x-2">
                            <div className="flex flex-col items-center justify-center rounded-full bg-white dark:bg-black w-10 h-10 p-2">
                                <FaInstagram size={18} className="text-black dark:text-white" />
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-full bg-white dark:bg-black w-10 h-10 p-2">
                                <FaFacebook size={18} className="text-black dark:text-white" />
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-full bg-white dark:bg-black w-10 h-10 p-2">
                                <FaXTwitter size={18} className="text-black dark:text-white" />
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-full bg-white dark:bg-black w-10 h-10 p-2">
                                <FaYoutube size={18} className="text-black dark:text-white" />
                            </div>
                        </div>
                    </div>

                    {/* extra links */}
                    <div className="flex flex-col w-full md:w-1/3 h-full bg-black dark:bg-white items-start justify-start overflow-hidden p-6">
                        <h1 className="text-white dark:text-black font-bold text-xl pb-2">Extra Links</h1>
                        <Link href={"/"} className="text-white dark:text-black font-medium text-md pb-2" >Home</Link>
                        <Link href={"https://www.semafacts.com/about-us/"} className="text-white dark:text-black font-medium text-md pb-2" >About Us</Link>
                        <Link href={"https://semafacts.com/blog/"} className="text-white dark:text-black font-medium text-md pb-2" >Blogs</Link>
                        <Link href={"https://semafacts.com/contact-us/"} className="text-white dark:text-black font-medium text-md pb-2" >Contact Us</Link>
                        <Link href="https://semafacts.com/privacy-policy/" className="text-white dark:text-black font-medium text-md pb-2" >Privacy Policy</Link>
                    </div>

                    {/* contact */}
                    <div className="flex flex-col w-full md:w-1/3 h-full bg-black dark:bg-white items-start justify-start overflow-hidden p-6">
                        <h1 className="text-white dark:text-black font-bold text-xl pb-2">Contact</h1>
                        <p className="text-white dark:text-black text-md font-normal pb-2">6th Floor Ally's Centre, 5 Muthithi Road, Westlands, Nairobi, Kenya</p>
                        <p className="text-white dark:text-black text-md font-normal pb-2">info@semafacts.com</p>
                        <p className="text-white dark:text-black text-md font-normal pb-2">(+254) 729 716 568</p>
                    </div>
                </div>
                    <p className='text-sm text-white dark:text-black font-light'>© {new Date().getFullYear()} SemaFacts. All rights reserved.</p>
            </div>

        </footer>
    );
}