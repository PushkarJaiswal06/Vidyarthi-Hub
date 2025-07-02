import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaArrowRight } from "react-icons/fa";

function AnimatedFooterBar() {
  return (
    <div className="w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-500 animate-gradient-x rounded-t absolute top-0 left-0"></div>
  );
}



// Add this to your global CSS (e.g., index.css or App.css):
/*
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 4s ease-in-out infinite;
}
*/

export default function Footer() {
  return (
    <footer className="w-full bg-[#181824] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top Row: Quote & Nav */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Empowering students and instructors to achieve more, together.
            </h2>
          </div>
          <nav className="flex flex-wrap gap-6 text-lg font-semibold justify-start md:justify-end">
            <Link to="/about" className="hover:text-cyan-300 transition">About</Link>
            <Link to="/catalog" className="hover:text-cyan-300 transition">Courses</Link>
            <Link to="/contact" className="hover:text-cyan-300 transition">Contact</Link>
            <Link to="/team" className="hover:text-cyan-300 transition">Team</Link>
            <Link to="/login" className="hover:text-cyan-300 transition">Login</Link>
            <Link to="/signup" className="hover:text-cyan-300 transition">Signup</Link>
          </nav>
        </div>

        {/* Middle Row: Action Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 border-2 border-cyan-400 rounded-xl p-6 flex flex-col items-center bg-[#181824]/80">
            <span className="text-xl font-bold mb-3 text-center">Need help with your learning journey?</span>
            <a
              href="mailto:pushkarbst90@gmail.com"
              className="bg-cyan-400 text-[#181824] font-bold px-6 py-2 rounded-lg shadow hover:bg-cyan-300 transition mt-2"
            >
              pushkarbst90@gmail.com
            </a>
          </div>
          <div className="flex-1 border-2 border-cyan-400 rounded-xl p-6 flex flex-col items-center bg-[#181824]/80">
            <span className="text-xl font-bold mb-3 text-center">Want to see my professional profile?</span>
            <a
              href="https://www.linkedin.com/in/pushkar-jaiswal-1b6b28249/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-cyan-400 text-cyan-200 font-bold px-6 py-2 rounded-lg shadow hover:bg-cyan-400 hover:text-[#181824] transition mt-2"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* Bottom Row: Logo, Socials, Made by, Copyright */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">VidyarthiHub</span>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Made by</span>
              <a
                href="https://www.linkedin.com/in/pushkar-jaiswal-1b6b28249/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cyan-300"
              >
                Pushkar Jaiswal
              </a>
            </div>
            <div className="text-xs text-gray-400">© 2024 VidyarthiHub. All rights reserved.</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/pushkar-jaiswal06/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-cyan-300 hover:text-white text-2xl" />
              </a>
              <a href="https://github.com/pushkarjaiswal06" target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-cyan-300 hover:text-white text-2xl" />
              </a>
              <a href="https://www.instagram.com/pushkar_j.06" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-cyan-300 hover:text-white text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}