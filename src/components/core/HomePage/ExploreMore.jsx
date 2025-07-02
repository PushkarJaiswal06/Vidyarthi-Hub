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
        // Set some dummy data for demo purposes
        setCourses([
          {
            heading: "Introduction to Web Development",
            description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
            level: "Beginner",
            lessionNumber: 12,
            courseId: "1",
            thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
            price: "Free",
            instructor: { firstName: "John", lastName: "Doe" }
          },
          {
            heading: "Advanced JavaScript Concepts",
            description: "Master advanced JavaScript patterns, async programming, and modern ES6+ features.",
            level: "Intermediate",
            lessionNumber: 18,
            courseId: "2",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
            price: "₹999",
            instructor: { firstName: "Jane", lastName: "Smith" }
          },
          {
            heading: "React Development Masterclass",
            description: "Build modern web applications with React, Redux, and advanced state management.",
            level: "Advanced",
            lessionNumber: 24,
            courseId: "3",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            price: "₹1499",
            instructor: { firstName: "Mike", lastName: "Johnson" }
          }
        ]);
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
        <p className="text-neutral-600 mt-4">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Explore more section */}
      <div className="text-center mb-16">
        <div className="text-4xl font-semibold text-neutral-900 mb-4">
          Unlock the
          <HighlightText text={"Power of Code"} />
        </div>
        <p className="text-center text-neutral-600 text-lg font-medium">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* Tabs Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {tabsName.map((ele, index) => {
          return (
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentTab === ele
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow"
                  : "bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200"
              }`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </button>
          );
        })}
      </div>

      {/* Cards Group - Fixed Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
          <div className="col-span-full text-center text-neutral-600 py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No courses available</h3>
            <p className="text-neutral-500">Check back soon for new courses in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreMore;