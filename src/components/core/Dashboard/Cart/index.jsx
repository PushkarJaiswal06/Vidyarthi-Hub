import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const navigate = useNavigate()
  const { total, totalItems, cart } = useSelector((state) => state.cart)

  const handleCheckout = () => {
    // Navigate to checkout or trigger payment
    console.log("Checkout clicked")
    // You can implement actual checkout logic here
  }
  
  console.log("Cart component - cart data:", cart)
  console.log("Cart component - total:", total)
  console.log("Cart component - totalItems:", totalItems)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800 p-6">
      <h1 className="mb-10 text-3xl font-bold text-white">Cart</h1>
      <p className="border-b border-cyan-900/40 pb-2 font-semibold text-cyan-200">
        {totalItems} Courses in Cart
      </p>
      {totalItems > 0 ? (
        <div className="mt-8 flex flex-col-reverse lg:flex-row gap-10">
          <div className="flex-1">
            <RenderCartCourses />
          </div>
          <div className="w-full max-w-sm lg:sticky lg:top-24">
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-cyan-100">
          Your cart is empty
        </p>
      )}
      {/* Sticky Checkout Bar for mobile */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-cyan-900/90 py-4 flex justify-center gap-4 z-40 lg:hidden">
          <button 
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-8 rounded-xl shadow-lg transition-all"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  )
}