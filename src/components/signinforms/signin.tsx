"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import LoadingScreen from "@/components/loadingscreens/loadingmainscreen";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

// reCAPTCHA site key from .env.local
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function SignInForm() {
  const router = useRouter();

  // Sign‑in form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New: full‑screen redirect loader
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Forgot‑password flow state
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<1 | 2 | 3>(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmNewPassword, setFpConfirmNewPassword] = useState("");
  const [fpStatus, setFpStatus] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [fpCaptchaToken, setFpCaptchaToken] = useState<string | null>(null);

  // If we're redirecting, show the full‑screen loader
  if (isRedirecting) {
    return <LoadingScreen />;
  }

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
        // Short pause so user sees success message, then redirect
        setTimeout(() => {
          setIsRedirecting(true);
          if (data.role === "superadmin") {
            router.push("/superadmindashboard");
          } else if (data.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/homepage");
          }
        }, 800);
      } else {
        setStatus(data.message || "Sign in error.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
    setForgotPasswordStep(1);
    setFpEmail("");
    setFpCode("");
    setFpNewPassword("");
    setFpConfirmNewPassword("");
    setFpStatus("");
    setFpCaptchaToken(null);
  };

  const handleCancel = () => {
    setForgotPasswordModalOpen(false);
    setForgotPasswordStep(1);
    setFpStatus("");
    setFpCaptchaToken(null);
  };

  // Step 1: Send verification code
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus("");
    if (!fpCaptchaToken) {
      setFpStatus("Please complete the CAPTCHA.");
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch("/api/auth/sendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, captchaToken: fpCaptchaToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotPasswordStep(2);
      } else {
        setFpStatus(data.message || "Error sending code.");
        setFpCaptchaToken(null);
      }
    } catch {
      setFpStatus("Error sending verification code.");
      setFpCaptchaToken(null);
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
        setFpStatus(data.message || "Verification failed.");
      }
    } catch {
      setFpStatus("Error verifying code.");
    } finally {
      setFpLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus("");
    if (fpNewPassword.length !== 8) {
      setFpStatus("Password must be exactly 8 characters.");
      return;
    }
    if (fpNewPassword !== fpConfirmNewPassword) {
      setFpStatus("Passwords do not match.");
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, newPassword: fpNewPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setFpStatus("Password reset! You can now sign in.");
        setTimeout(handleCancel, 1500);
      } else {
        setFpStatus(data.message || "Error resetting password.");
      }
    } catch {
      setFpStatus("Error resetting password.");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-8 border border-[#e6dfd3] hover:shadow-xl transition">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#f8f5f0] rounded-full flex items-center justify-center shadow-sm">
            <LogIn size={28} className="text-[#8d6e63]" />
          </div>
          <h2 className="text-2xl font-bold text-[#5d4037]">Welcome Back</h2>
          <p className="text-[#8d6e63] mt-2">Sign in to your account</p>
        </div>

        {/* Sign‑in Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-[#5d4037]">Password</label>
              <button
                type="button"
                onClick={openForgotPasswordModal}
                className="text-xs text-[#8d6e63] hover:underline"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`p-3 rounded-lg ${
                status.toLowerCase().includes("error")
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 
                    7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <LogIn size={18} />
            )}
            <span>{isLoading ? "Signing In..." : "Sign In"}</span>
          </button>

          <div className="pt-2 text-center">
            <p className="text-[#8d6e63] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#5d4037] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </form>

        {/* Forgot Password Modal */}
        {forgotPasswordModalOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={handleCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full space-y-6">
                {forgotPasswordStep === 1 && (
                  <form onSubmit={handleSendVerificationCode} className="space-y-4">
                    <h2 className="text-xl font-bold text-[#5d4037]">Forgot Password</h2>
                    <p className="text-sm text-[#8d6e63]">
                      Enter your email and complete the CAPTCHA to receive a code.
                    </p>
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
                          value={fpEmail}
                          onChange={(e) => setFpEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={setFpCaptchaToken}
                      />
                    </div>
                    {fpStatus && <p className="text-red-600 text-sm">{fpStatus}</p>}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!fpCaptchaToken || fpLoading}
                        className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg disabled:opacity-70"
                      >
                        {fpLoading ? "Sending…" : "Send Code"}
                      </button>
                    </div>
                  </form>
                )}

                {forgotPasswordStep === 2 && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <h2 className="text-xl font-bold text-[#5d4037]">Enter Verification Code</h2>
                    <p className="text-sm text-[#8d6e63]">
                      We’ve sent a code to {fpEmail}. Enter it below.
                    </p>
                    <input
                      type="text"
                      value={fpCode}
                      onChange={(e) => setFpCode(e.target.value)}
                      required
                      placeholder="123456"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
                    />
                    {fpStatus && <p className="text-red-600 text-sm">{fpStatus}</p>}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={fpLoading}
                        className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg disabled:opacity-70"
                      >
                        {fpLoading ? "Verifying…" : "Verify"}
                      </button>
                    </div>
                  </form>
                )}

                {forgotPasswordStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <h2 className="text-xl font-bold text-[#5d4037]">Reset Password</h2>
                    <p className="text-sm text-[#8d6e63]">
                      Enter your new password below (must be exactly 8 characters):
                    </p>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#5d4037]">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={fpNewPassword}
                          onChange={(e) => setFpNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          maxLength={8}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#5d4037]">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmNewPassword ? "text" : "password"}
                          value={fpConfirmNewPassword}
                          onChange={(e) => setFpConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          maxLength={8}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] bg-[#faf6f0] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword((v) => !v)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8d6e63] hover:text-[#5d4037] transition"
                          aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {fpStatus && (
                      <div
                        className={`p-3 rounded-lg ${
                          fpStatus.toLowerCase().includes("error")
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        <p className="text-sm">{fpStatus}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={fpLoading}
                        className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg disabled:opacity-70"
                      >
                        {fpLoading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
