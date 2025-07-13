import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"
import Navbar from '../components/common/Navbar';

function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800 relative flex flex-col">
      {/* Navbar - dark glassy, floating */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar className="bg-gradient-to-r from-richblack-900/80 via-cyan-900/80 to-richblack-800/80 backdrop-blur-xl shadow-lg border-b border-cyan-900/30" />
      </div>
      {/* Unified Dashboard Card - now full screen */}
      <div className="flex flex-1 w-full min-h-screen">
        <div className="w-full h-full bg-gradient-to-br from-richblack-900/90 via-cyan-900/80 to-richblack-800/90 shadow-2xl shadow-cyan-900/40  border-cyan-900/40 backdrop-blur-xl flex overflow-hidden ">
          {/* Sidebar - always rendered for mobile/desktop responsiveness */}
          <Sidebar />
          {/* Main Content - integrated, dark glassy */}
          <main className="flex-1 min-h-[70vh] p-0 flex flex-col h-full w-full mt-6 lg:mt-8 pt-20 lg:pt-0 lg:ml-64">
            <div className="w-full h-full p-0"> {/* Remove padding for full stretch */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard