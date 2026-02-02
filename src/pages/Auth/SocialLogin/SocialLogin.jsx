import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

const SocialLogin = () => {
  const { signInGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Handle Google login
  const handleGoogleLogin = () => {
    signInGoogle()
      .then((res) => {
        navigate(location?.state || "/");
        toast.success("Login successful!");
        // console.log(res.user);
      })
      .catch((error) => {
        toast.error(error?.message || "Google login failed!");
      });
  };
  return (
    <>
      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default SocialLogin;
