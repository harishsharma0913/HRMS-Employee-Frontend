import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from 'lucide-react';
import { sendOtp, verifyOtp, resetPassword, resetForgotState } from "../ReduxToolkit/forgotSlice";
import { useToast } from "../Toast/ToastProvider";

export default function ForgotPasswordModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error } = useSelector((state) => state.forgotPassword);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);


  // Timer for OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (!open) return null;

  // ---------------------------- STEP 1 Submit (Send OTP)
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    dispatch(sendOtp({ email })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setStep(2);
        setTimer(300);
        showToast("Please enter the OTP below to verify your identity.","success");
      }
    });
  };

  // ---------------------------- STEP 2 Submit (Verify OTP)
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    dispatch(verifyOtp({ email, otp })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setStep(3);
        showToast("Enter a 8 digit strong password.", "success")
      }
    });
  };

  // ---------------------------- STEP 3 Submit (Reset Password)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;

    dispatch(resetPassword({ email, newPassword })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        onClose();
        showToast("Password Forgot successfully!", "success");
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-xl font-bold text-center text-blue-600">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Enter New Password"}
        </h2>

        {/*------------------------- STEP 1 — EMAIL FORM ------------------------*/}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 mt-2">
            <p className="text-sm text-gray-600 text-center">
              Enter your registered email to receive an OTP.
            </p>

            <input
              type="email"
              required
              placeholder="employee@gmail.com"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/*------------------------- STEP 2 — OTP FORM ------------------------*/}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 mt-4">

            <input
              type="text"
              required
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter OTP"
              className="w-full border px-3 py-2 rounded tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {/* TIMER OR EXPIRED TEXT */}
            {timer > 0 ? (
              <p className="text-center text-sm text-gray-600">
                OTP expires in{" "}
                <span className="font-bold text-red-600">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-center text-sm font-semibold text-red-600">
                OTP expired. Please resend.
              </p>
            )}

            {/* VERIFY OTP BUTTON */}
            <button
              type="submit"
              disabled={loading || timer <= 0}
              className={`w-full py-2 rounded text-white ${
                loading || timer <= 0
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND OTP BUTTON */}
            {timer === 0 && (
              <button
                type="button"
                onClick={() => {
                  dispatch(sendOtp({ email })).then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                      setTimer(300); // Reset timer
                      setOtp("");    // Clear OTP
                      showToast("OTP resent successfully!", "success");
                    }
                  });
                }}
                className="w-full text-sm text-gray-600 hover:underline transition"
              >
                Resend OTP
              </button>
            )}

          </form>
        )}

        {/* ------------------- STEP 3 — PASSWORD FORM ------------------- */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                required
                minLength={8}
                placeholder="Enter New Password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
              />

              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showNewPass ? <Eye className="w-4 h-4 hover:text-blue-700" /> : <EyeOff className="w-4 h-4 hover:text-blue-700" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                required
                minLength={8}
                placeholder="Confirm New Password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
              />

              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showConfirmPass ? <Eye className="w-4 h-4 hover:text-blue-700" /> : <EyeOff className="w-4 h-4 hover:text-blue-700" />}
              </button>
            </div>

            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-red-500 text-sm font-semibold text-center">Please enter both password are same.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Forgot Password"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm text-center font-semibold mt-3">{error}</p>}

        <button
          className="mt-4 w-full text-gray-600 hover:underline text-sm"
          onClick={
            () => {
              setStep(1);
              setEmail("");
              setOtp("");
              setNewPassword("");
              setConfirmPassword("");
              dispatch(resetForgotState())
              onClose();
            }
          }
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
