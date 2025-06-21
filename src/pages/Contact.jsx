import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactPage/ContactDetails"
import ContactForm from "../components/ContactPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      
      {/* Reviews Section - Full Width */}
      <div className="w-full bg-richblack-900 py-20">
        <div className="mx-auto w-11/12 max-w-maxContent">
          <h1 className="text-center text-4xl font-semibold text-white mb-12">
            Reviews from other learners
          </h1>
          <ReviewSlider />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Contact