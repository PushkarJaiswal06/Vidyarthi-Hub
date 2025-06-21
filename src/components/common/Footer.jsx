import React from "react";
import { Link } from "react-router-dom";
import HighlightText from "../core/HomePage/HighlightText";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Terms of Service", "Contact Us"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <div className="text-2xl font-bold text-white">
                <HighlightText text="VidyarthiHub" />
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/about">About</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/contact">Contact</Link>
                </div>
              </div>
              <div className="flex gap-3 text-lg">
                <a 
                  href="https://github.com/PushkarJaiswal06" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-richblack-50 transition-all duration-200"
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://www.linkedin.com/in/pushkar-jaiswal06/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-richblack-50 transition-all duration-200"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="https://www.instagram.com/pushkar_j.06" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-richblack-50 transition-all duration-200"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/catalog">Browse Courses</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/dashboard">Dashboard</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/signup">Become Instructor</Link>
                </div>
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to="/contact">Help Center</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Legal
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/privacy">Privacy Policy</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/terms">Terms of Service</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/contact">Contact Us</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Quick Links
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/">Home</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/catalog">Catalog</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/about">About</Link>
                </div>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                  <Link to="/contact">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center">Made with ❤️ by <a 
                  href="https://www.linkedin.com/in/pushkar-jaiswal06/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-25 font-semibold hover:text-yellow-50 transition-all duration-200 underline"
                >
                 {" "}
                 <HighlightText text="Pushkar Jaiswal " />
                </a> © 2025 
                
                </div>

          
        </div>
      </div>
    </div>
  );
};

export default Footer;