import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"
import HighlightText from "../core/HomePage/HighlightText"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: <a href="https://www.linkedin.com/in/pushkar-jaiswal06/" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-black-900 transition-all duration-200">https://www.linkedin.com/in/pushkar-jaiswal06/</a>,
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Gorakhpur, Uttar Pradesh, India",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "8840575310",
  },
]

const ContactDetails = () => {
  return (
    <div className="card-modern p-6">
      {/* Portfolio Section */}
      <div className="flex flex-col items-center gap-4 p-6 border-b border-cyan-400/20 mb-6">
        <div className="w-40 h-52 rounded-2xl overflow-hidden border-4 border-cyan-400/30 shadow-lg bg-gradient-to-br from-cyan-400/10 to-blue-400/10 backdrop-blur-sm flex items-center justify-center">
          <img 
            src={require("../../assets/Images/PJ.jpg")} 
            alt="Pushkar Jaiswal" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-black mb-2">
            <HighlightText text="Pushkar Jaiswal" />
          </h2>
          <p className="text-cyan-200 text-sm mb-3">
            Full Stack Developer & Creator of VidyarthiHub
          </p>
          <p className="text-cyan-100 text-xs mb-4">
            Passionate about creating innovative learning experiences and building scalable web applications
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/PushkarJaiswal06" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 transition-all duration-200 hover:scale-110 social-icon-glow"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/pushkar-jaiswal06/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 transition-all duration-200 hover:scale-110 social-icon-glow"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="https://www.instagram.com/pushkar_j.06" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 transition-all duration-200 hover:scale-110 social-icon-glow"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      {contactDetails.map((ele, i) => {
        let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
        return (
          <div
            className="flex flex-col gap-[2px] p-3 text-sm text-cyan-200"
            key={i}
          >
            <div className="flex flex-row items-center gap-3">
              <Icon size={25} className="text-cyan-400" />
              <h1 className="text-lg font-semibold text-white">
                {ele?.heading}
              </h1>
            </div>
            <p className="font-medium text-cyan-200">{ele?.description}</p>
            <p className="font-semibold text-cyan-100">{ele?.details}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails