import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API, RAZORPAY_KEY_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// Function to get Razorpay key from server
async function getRazorpayKey() {
    try {
        console.log("Requesting Razorpay key from server...");
        console.log("Endpoint:", RAZORPAY_KEY_API);
        console.log("Full URL should be:", RAZORPAY_KEY_API);
        
        // Test the URL construction
        const testUrl = "http://localhost:4000/api/v1/razorpay-key";
        console.log("Testing direct URL:", testUrl);
        
        const response = await apiConnector("GET", RAZORPAY_KEY_API);
        console.log("Razorpay key response:", response);
        console.log("Response data type:", typeof response.data);
        console.log("Response data preview:", typeof response.data === 'string' ? response.data.substring(0, 100) : response.data);
        
        // Check if response contains HTML (indicating a routing error)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
            console.log("ERROR: Received HTML instead of JSON. Server might not be running or endpoint is wrong.");
            console.log("This suggests the request is hitting the React dev server instead of the backend.");
            throw new Error("Server returned HTML instead of JSON. Check if server is running on port 4000.");
        }
        
        if (response.data.success) {
            console.log("Razorpay key received successfully");
            return response.data.key;
        }
        console.log("Failed to get Razorpay key:", response.data.message);
        throw new Error(response.data.message || "Could not get Razorpay key");
    } catch (error) {
        console.log("RAZORPAY KEY ERROR:", error);
        if (error.response) {
            console.log("Error response status:", error.response.status);
            console.log("Error response data:", error.response.data);
        }
        throw error;
    }
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try{
        console.log("=== BUY COURSE DEBUG ===");
        console.log("Token:", token ? "PRESENT" : "MISSING");
        console.log("Courses:", courses);
        console.log("User details:", userDetails);
        
        //initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer ${token}`,
                                })

        console.log("Order response:", orderResponse);

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);
        
        // Check if this is a free course
        if (orderResponse.data.data.amount === 0) {
            console.log("Free course detected, skipping payment flow...");
            toast.success("Enrolled successfully in free course!");
            navigate("/dashboard/enrolled-courses");
            dispatch(resetCart());
            toast.dismiss(toastId);
            return;
        }
        
        console.log("Loading Razorpay script...");
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
        
        console.log("Getting Razorpay key...");
        // Get Razorpay key from server
        const razorpayKey = await getRazorpayKey();
        console.log("Razorpay key received:", razorpayKey ? "PRESENT" : "MISSING");
        
        //options
        const options = {
            key: razorpayKey,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name:"VidyarthiHub",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) {
                console.log("Payment successful:", response);
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token );
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        
        console.log("Payment options:", options);
        console.log("Opening Razorpay payment window...");
        
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            console.log("Payment failed:", response);
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }
    catch(error) {
        console.log("=== PAYMENT API ERROR ===");
        console.log("Error message:", error.message);
        console.log("Full error:", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}