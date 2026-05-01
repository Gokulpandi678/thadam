import images from "../assets";
import { LogIn } from "lucide-react";
import { backend_base_url } from "../service/api/apiClient";

const Login = () => {
  const handleClick = () => {
    window.location.href = `${backend_base_url}/auth/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-15 w-15 rounded-xl flex items-center justify-center">
            <img src={images.logo} alt="thadam_crm_logo" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-blue-500 tracking-wider">THADAM</h2>
          <p className="mt-2 text-sm text-gray-600">Customer Relationship Management System</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800 text-center">
            Welcome back! Please sign in to access your dashboard, manage customers, and track
            activities.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleClick}
            className="group relative w-full flex justify-center gap-5 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-500 hover:bg-blue-600 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            Sign in to your account
            <LogIn />
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-100">
          <p className="flex items-center justify-center gap-2">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure authentication powered by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
