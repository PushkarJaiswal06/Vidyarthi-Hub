import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import { FaCheck } from "react-icons/fa"
import { toast } from "react-hot-toast"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import { addToCart } from "../slices/cartSlice"
import { ACCOUNT_TYPE } from "../utils/constants"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Getting courseId from url parameter
  const { courseId } = useParams()
  // console.log(`course id: ${courseId}`)

  // Declear a state to save the course details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        // console.log("course details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  // console.log("response: ", response)

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // // Collapse all
  // const [collapse, setCollapse] = useState("")
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data?.courseDetails

  const handleBuyCourse = () => {
    if (user && studentsEnrolled?.includes(user?._id)) {
      navigate("/dashboard/enrolled-courses")
      return
    }
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(response.data?.courseDetails))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800 min-h-screen">
        {/* Hero Section */}
        <div className="mx-auto px-4 py-10 max-w-5xl flex flex-col md:flex-row gap-10">
          {/* Course Thumbnail */}
          <div className="flex-shrink-0 w-full md:w-1/3 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl border border-cyan-900/30">
            <img src={thumbnail} alt="course thumbnail" className="w-full h-64 object-cover" />
          </div>
          {/* Course Info Card */}
          <div className="flex-1 flex flex-col gap-6 bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-900/30">
            <h1 className="text-3xl font-bold text-white mb-2">{courseName}</h1>
            <p className="text-cyan-100 text-lg mb-2">{courseDescription}</p>
            <div className="flex flex-wrap items-center gap-4 text-cyan-200">
              <span className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                <FaStar /> {isNaN(avgReviewCount) ? 0 : avgReviewCount}
              </span>
              <RatingStars Review_Count={isNaN(avgReviewCount) ? 0 : avgReviewCount} Star_Size={24} />
              <span>({ratingAndReviews?.length || 0} reviews)</span>
              <span>{studentsEnrolled?.length || 0} students enrolled</span>
            </div>
            <div className="flex items-center gap-3 text-cyan-200">
              <span>By {instructor.firstName} {instructor.lastName}</span>
              <span className="flex items-center gap-1"><BiInfoCircle /> Created {formatDate(createdAt)}</span>
              <span className="flex items-center gap-1"><HiOutlineGlobeAlt /> English</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button 
                className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg" 
                onClick={handleBuyCourse}
              >
                {user && studentsEnrolled?.includes(user?._id) ? "Go To Course" : "Buy Now"}
              </button>
              {(!user || !studentsEnrolled?.includes(user?._id)) && (
                <button 
                  className="bg-white/20 hover:bg-cyan-900 text-cyan-100 font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
              <div className="text-3xl font-bold text-cyan-200 flex items-center">Rs. {price}</div>
            </div>
          </div>
        </div>
        {/* What will you learn */}
        <div className="mx-auto max-w-5xl mt-10 bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-900/30">
          <h2 className="text-2xl font-bold text-white mb-4">What you'll learn</h2>
          <ul className="list-disc pl-6 text-cyan-100 space-y-2">
            {whatYouWillLearn?.split('\n').map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
                 {/* Curriculum */}
         <div className="mx-auto max-w-5xl mt-10 bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-900/30">
           <h2 className="text-2xl font-bold text-white mb-4">Course Curriculum</h2>
           <div className="space-y-4">
             {courseContent?.map((course, index) => (
               <CourseAccordionBar
                 course={course}
                 key={index}
                 isActive={isActive}
                 handleActive={handleActive}
               />
             ))}
           </div>
         </div>
        {/* Author Details */}
        <div className="mx-auto max-w-5xl mt-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-900/30 p-8">
          <h2 className="text-2xl font-bold text-white ">Author</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={instructor.image ? instructor.image : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName}%20${instructor.lastName}`}
              alt="Author"
              className="h-24 w-24 rounded-full object-cover border-4 border-cyan-900/40 shadow-lg "
            />
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">{instructor.firstName} {instructor.lastName}</h3>
              <p className="text-cyan-100 text-base">{instructor?.additionalDetails?.about || "No bio available."}</p>
            </div>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails