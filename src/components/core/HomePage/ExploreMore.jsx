import React, { useState, useEffect } from "react";
import { apiConnector } from "../../../services/apiconnector";
import { courseEndpoints } from "../../../services/apis";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState("");

  // Fetch all courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);
        if (response.data.success) {
          const fetchedCourses = response.data.data;
          setAllCourses(fetchedCourses);
          
          // Set initial courses for "Free" tab
          const freeCourses = getCoursesForTab("Free", fetchedCourses);
          setCourses(freeCourses);
          if (freeCourses.length > 0) {
            setCurrentCard(freeCourses[0].heading);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to get courses for each tab
  const getCoursesForTab = (tabName, courses) => {
    let filteredCourses = [];
    
    switch (tabName) {
      case "Free":
        // Courses with price 0 or null
        filteredCourses = courses.filter(course => !course.price || course.price === 0);
        break;
      case "New to coding":
        // Recently created courses (last 30 days) or courses with "beginner" in description
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredCourses = courses.filter(course => 
          new Date(course.createdAt) > thirtyDaysAgo ||
          course.courseDescription?.toLowerCase().includes('beginner') ||
          course.courseName?.toLowerCase().includes('introduction') ||
          course.courseName?.toLowerCase().includes('basic') ||
          course.courseName?.toLowerCase().includes('fundamental')
        );
        break;
      case "Most popular":
        // Courses with highest enrollment or ratings
        filteredCourses = courses.sort((a, b) => 
          (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
        );
        break;
      case "Skills paths":
        // Courses that are part of skill development paths
        filteredCourses = courses.filter(course => 
          course.courseDescription?.toLowerCase().includes('skill') ||
          course.courseDescription?.toLowerCase().includes('path') ||
          course.courseDescription?.toLowerCase().includes('development') ||
          course.courseDescription?.toLowerCase().includes('programming') ||
          course.courseDescription?.toLowerCase().includes('coding') ||
          course.tag?.some(tag => tag.toLowerCase().includes('skill')) ||
          course.category?.name?.toLowerCase().includes('development')
        );
        break;
      case "Career paths":
        // Courses focused on career development
        filteredCourses = courses.filter(course => 
          course.courseDescription?.toLowerCase().includes('career') ||
          course.courseDescription?.toLowerCase().includes('job') ||
          course.courseDescription?.toLowerCase().includes('professional') ||
          course.courseDescription?.toLowerCase().includes('industry') ||
          course.courseDescription?.toLowerCase().includes('work') ||
          course.courseName?.toLowerCase().includes('career') ||
          course.category?.name?.toLowerCase().includes('career')
        );
        break;
      default:
        filteredCourses = courses;
    }

    // If no courses found for specific tab, distribute courses evenly
    if (filteredCourses.length === 0) {
      const tabIndex = tabsName.indexOf(tabName);
      const coursesPerTab = Math.ceil(courses.length / tabsName.length);
      const startIndex = tabIndex * coursesPerTab;
      filteredCourses = courses.slice(startIndex, startIndex + coursesPerTab);
    }

    // Transform and limit to 3 courses
    return filteredCourses.slice(0, 3).map(course => ({
      heading: course.courseName,
      description: course.courseDescription,
      level: "All Levels",
      lessionNumber: course.courseContent?.length || 0,
      courseId: course._id,
      thumbnail: course.thumbnail,
      price: course.price,
      instructor: course.instructor
    }));
  };

  const setMyCards = (value) => {
    setCurrentTab(value);
    const tabCourses = getCoursesForTab(value, allCourses);
    setCourses(tabCourses);
    if (tabCourses.length > 0) {
      setCurrentCard(tabCourses[0].heading);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="text-richblack-300 mt-4">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((ele, index) => {
          return (
            <div
              className={` text-[16px] flex flex-row items-center gap-2 ${
                currentTab === ele
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.length > 0 ? (
          courses.map((ele, index) => {
            return (
              <CourseCard
                key={index}
                cardData={ele}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            );
          })
        ) : (
          <div className="text-center text-richblack-300 w-full">
            No courses available in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreMore;