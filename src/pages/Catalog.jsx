import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()

  // State for all categories (for /catalog)
  const [allCategories, setAllCategories] = useState([])
  const [fetchError, setFetchError] = useState(null)

  // State for category-specific page (for /catalog/:catalogName)
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories for /catalog
  useEffect(() => {
    if (!catalogName) {
      const fetchCategoriesWithCourses = async () => {
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API)
          setAllCategories(res.data.data)
        } catch (error) {
          setFetchError(error)
        }
      }
      fetchCategoriesWithCourses()
    }
  }, [catalogName])

  // Fetch category-specific data for /catalog/:catalogName
  useEffect(()=> {
    if (catalogName) {
      const getCategories = async() => {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const category_id = 
          res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]?._id;
        setCategoryId(category_id);
      }
      getCategories();
    }
  },[catalogName]);

  useEffect(() => {
    if (catalogName && categoryId) {
      const getCategoryDetails = async() => {
        try{
          const res = await getCatalogaPageData(categoryId);
          setCatalogPageData(res);
        }
        catch(error) {
          setFetchError(error)
        }
      }
      getCategoryDetails();
    }
  },[catalogName, categoryId]);

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (fetchError) {
    return <Error />
  }

  // If on /catalog, show all categories
  if (!catalogName) {
    return (
      <>
        <div className="box-content bg-richblack-800 px-4">
          <div className="mx-auto flex min-h-[120px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-3xl text-richblack-5 font-bold py-8">All Courses by Category</p>
          </div>
        </div>
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          {allCategories.length === 0 ? (
            <div className="text-center text-richblack-300">No categories or courses found.</div>
          ) : (
            allCategories.map((cat) => (
              <div key={cat._id} className="mb-12">
                <h2 className="text-2xl font-semibold text-richblack-5 mb-2">{cat.name}</h2>
                <p className="text-richblack-200 mb-4">{cat.description}</p>
                {cat.courses && cat.courses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cat.courses.map((course) => (
                      <Course_Card course={course} key={course._id} Height={"h-[400px]"} />
                    ))}
                  </div>
                ) : (
                  <div className="text-richblack-300 italic mb-8">No courses in this category yet.</div>
                )}
              </div>
            ))
          )}
        </div>
        <Footer />
      </>
    )
  }

  // If on /catalog/:catalogName, show category-specific view (old logic)
  if (!loading && catalogName && catalogPageData) {
    if (!catalogPageData.success) {
      return <Error />
    }
    return (
      <>
        {/* Hero Section */}
        <div className=" box-content bg-richblack-800 px-4">
          <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-yellow-25">
                {catalogPageData?.data?.selectedCategory?.name}
              </span>
            </p>
            <p className="text-3xl text-richblack-5">
              {catalogPageData?.data?.selectedCategory?.name}
            </p>
            <p className="max-w-[870px] text-richblack-200">
              {catalogPageData?.data?.selectedCategory?.description}
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">Courses to get you started</div>
          <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p
              className={`px-4 py-2 ${
                active === 1
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(1)}
            >
              Most Populer
            </p>
            <p
              className={`px-4 py-2 ${
                active === 2
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(2)}
            >
              New
            </p>
          </div>
          <div>
            <CourseSlider
              Courses={catalogPageData?.data?.selectedCategory?.courses}
            />
          </div>
        </div>
        {/* Section 2 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">
            Top courses in {catalogPageData?.data?.differentCategory?.name}
          </div>
          <div className="py-8">
            <CourseSlider
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </div>

        {/* Section 3 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">Frequently Bought</div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, i) => (
                  <Course_Card course={course} key={i} Height={"h-[400px]"} />
                ))}
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }

  return null;
}

export default Catalog