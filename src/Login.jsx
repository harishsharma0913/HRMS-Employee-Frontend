import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo from "./assets/RNS-logo.png";
import rigthImage from "./assets/RightImage.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, fetchEmployeeData } from "./ReduxToolkit/authSlice";
import ForgotPasswordModal from "./ForgotPasswordFlow/ForgotPasswordFlow";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [open , setOpen] = useState(false);
  const navigate = useNavigate();
  const holdTimeout = useRef(null); 
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("https://hrms-backend-i9gs.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
       onLogin?.(data.employee);
      dispatch(loginSuccess({ token: data.token, employee: data.employee })); 
      dispatch(fetchEmployeeData());          
      navigate("/home");
      setError("");
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    setError("Something went wrong. Try again.");
    console.error("Login error:", err);
  }
};

   const handleHoldStart = (e) => {
    e.preventDefault(); 
    holdTimeout.current = setTimeout(() => setShowPassword(true), 200);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
    setShowPassword(false);
  };

  return (
   <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden">
      {/* Left Side: Logo + Form */}
      <div className="flex-1 relative px-6 py-4">
        {/* Logo at top-left */}
        <div className="absolute top-4 left-10">
          <img src={logo} alt="HRMS Logo" className="h-6 md:h-8" />
        </div>

        {/* Centered Login Form */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-200 shadow-xl w-full max-w-sm transform transition-all duration-500 hover:scale-[1.01]">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Login to your Account</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-xl text-gray-500 hover:text-gray-700"
              onPointerDown={handleHoldStart}
              onPointerUp={handleHoldEnd}
              onPointerLeave={handleHoldEnd}
              onPointerCancel={handleHoldEnd}
              title="Double Tap and Hold to show password"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

              <div className="flex items-center justify-center text-sm">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                 className="text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Log in
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-sm text-center font-bold animate-pulse mt-3">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Full Cover Image */}
      <div className="hidden md:block flex-1 relative">
        <img
          src={rigthImage}
          alt="Login Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    {open && <ForgotPasswordModal open={open} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Login;
