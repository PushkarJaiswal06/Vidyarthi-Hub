import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-br from-richblack-900 via-purple-900 to-richblack-800 px-4">
      {loading ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="glass rounded-3xl shadow-neon p-8 flex flex-col items-center max-w-md w-full backdrop-blur-md">
          <h1 className="text-white font-extrabold text-3xl mb-2 drop-shadow-lg text-center">Verify Email</h1>
          <p className="text-cyan-100 text-lg mb-6 text-center">
            A verification code has been sent to your email. Enter the code below to verify your account.
          </p>
          <form onSubmit={handleVerifyAndSignup} className="w-full flex flex-col items-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-12 lg:w-14 border-0 bg-richblack-800/80 rounded-lg text-white aspect-square text-center text-2xl font-bold focus:border-0 focus:outline-2 focus:outline-cyan-400 transition-all duration-200"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 8px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-full mt-8 font-semibold text-lg shadow-neon hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-8 flex items-center justify-between w-full">
            <Link to="/signup" className="text-cyan-300 hover:underline flex items-center gap-x-2 text-base">
              <BiArrowBack /> Back To Signup
            </Link>
            <button
              className="flex items-center text-purple-300 hover:text-purple-400 gap-x-2 text-base underline underline-offset-2 transition-colors duration-200"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;