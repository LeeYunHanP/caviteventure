"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal states
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<1 | 2 | 3>(1);

  // For the Forgot Password flow
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmNewPassword, setFpConfirmNewPassword] = useState("");
  const [fpStatus, setFpStatus] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  // New states to control visibility of new password fields
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Submit Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Sign in successful!");
        // Redirect based on user role
        setTimeout(() => {
          if (data.role === "superadmin") {
            router.push("/superadmindashboard");
          } else if (data.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/homepage");
          }
        }, 1000);
      } else {
        setStatus(data.message || "Sign in error.");
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ---------- FORGOT PASSWORD FLOW ----------

  // 1) Open the first modal (Enter Email)
  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
    setForgotPasswordStep(1);
    setFpEmail("");
    setFpCode("");
    setFpNewPassword("");
    setFpConfirmNewPassword("");
    setFpStatus("");
  };

  // Cancel and close all modals
  const handleCancel = () => {
    setForgotPasswordModalOpen(false);
    setForgotPasswordStep(1);
    setFpEmail("");
    setFpCode("");
    setFpNewPassword("");
    setFpConfirmNewPassword("");
    setFpStatus("");
  };

  // Step 1: Send verification code
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus("");
    setFpLoading(true);

    try {
      // Using your API endpoint for sending verification email
      const res = await fetch("/api/auth/sendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        // Move to Step 2
        setForgotPasswordStep(2);
      } else {
        setFpStatus(data.message || "Error sending verification code.");
      }
    } catch (err) {
      console.error(err);
      setFpStatus("An error occurred while sending verification code.");
    } finally {
      setFpLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus("");
    setFpLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, code: fpCode }),
      });
      const data = await res.json();

      if (res.ok) {
        setForgotPasswordStep(3);
      } else {
        setFpStatus(data.message || "Code verification failed.");
      }
    } catch (err) {
      console.error(err);
      setFpStatus("An error occurred while verifying the code.");
    } finally {
      setFpLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus("");
    setFpLoading(true);

    // Validate new password length (must be exactly 8 characters)
    if (fpNewPassword.length !== 8) {
      setFpStatus("Password must be exactly 8 characters long.");
      setFpLoading(false);
      return;
    }
    // Check if new passwords match
    if (fpNewPassword !== fpConfirmNewPassword) {
      setFpStatus("Passwords do not match.");
      setFpLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          newPassword: fpNewPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setFpStatus("Password successfully reset. You may now sign in.");
        setTimeout(() => {
          handleCancel();
        }, 1500);
      } else {
        setFpStatus(data.message || "Error resetting password.");
      }
    } catch (err) {
      console.error(err);
      setFpStatus("An error occurred while resetting password.");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-8 border border-[#e6dfd3] transition-all duration-300 hover:shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#f8f5f0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <LogIn size={28} className="text-[#8d6e63]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#5d4037]">
            Welcome Back
          </h2>
          <p className="text-[#8d6e63] mt-2">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5d4037]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#a1887f]" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-[#5d4037]">
                Password
              </label>
              <button
                type="button"
                onClick={openForgotPasswordModal}
                className="text-xs text-[#8d6e63] hover:text-[#5d4037] hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#a1887f]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Status / Error Message */}
          {status && (
            <div
              className={`p-3 rounded-lg ${
                status.toLowerCase().includes("error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8d6e63] disabled:hover:shadow-sm"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Create Account Link */}
          <div className="pt-2 text-center">
            <p className="text-[#8d6e63] text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#5d4037] font-medium hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* ==================== FORGOT PASSWORD MODAL ==================== */}
      {forgotPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCancel}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-md w-full mx-4">
            {/* Step 1: Enter Email */}
            {forgotPasswordStep === 1 && (
              <form onSubmit={handleSendVerificationCode}>
                <h2 className="text-xl font-bold mb-4 text-[#5d4037]">
                  Forgot Password
                </h2>
                <p className="text-sm text-[#8d6e63] mb-4">
                  Enter your email to send a verification code.
                </p>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-[#5d4037]">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-[#a1887f]" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition-all duration-200"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Status/Error message */}
                {fpStatus && (
                  <div
                    className={`p-2 mb-3 rounded-md text-sm ${
                      fpStatus.toLowerCase().includes("error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {fpStatus}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg hover:bg-[#5d4037] transition-colors disabled:opacity-70"
                  >
                    {fpLoading ? "Sending..." : "Send Code"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {forgotPasswordStep === 2 && (
              <form onSubmit={handleVerifyCode}>
                <h2 className="text-xl font-bold mb-4 text-[#5d4037]">
                  Verification Code
                </h2>
                <p className="text-sm text-[#8d6e63] mb-4">
                  We have sent a code to your email. Please enter it below:
                </p>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-[#5d4037]">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition-all duration-200"
                    value={fpCode}
                    onChange={(e) => setFpCode(e.target.value)}
                    placeholder="123456"
                    required
                  />
                </div>

                {/* Status/Error message */}
                {fpStatus && (
                  <div
                    className={`p-2 mb-3 rounded-md text-sm ${
                      fpStatus.toLowerCase().includes("error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {fpStatus}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg hover:bg-[#5d4037] transition-colors disabled:opacity-70"
                  >
                    {fpLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {forgotPasswordStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <h2 className="text-xl font-bold mb-4 text-[#5d4037]">
                  Reset Password
                </h2>
                <p className="text-sm text-[#8d6e63] mb-4">
                  Enter your new password below (must be exactly 8 characters):
                </p>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5d4037]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition-all duration-200"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      maxLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  <label className="block text-sm font-medium text-[#5d4037]">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition-all duration-200"
                      value={fpConfirmNewPassword}
                      onChange={(e) => setFpConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      maxLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition-colors"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      aria-label={
                        showConfirmNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Status/Error message */}
                {fpStatus && (
                  <div
                    className={`p-2 my-3 rounded-md text-sm ${
                      fpStatus.toLowerCase().includes("error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {fpStatus}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg hover:bg-[#5d4037] transition-colors disabled:opacity-70"
                  >
                    {fpLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
