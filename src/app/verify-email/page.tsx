"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") || ""
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus("Verification successful! You can now sign in.")
        setTimeout(() => {
          router.push("/signin")
        }, 1500)
      } else {
        setStatus(data.message || "Verification error.")
      }
    } catch (err) {
      console.error(err)
      setStatus("An error occurred while verifying.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-sand-100">
      <div className="w-full max-w-md bg-white border border-sand-300 rounded shadow-md overflow-hidden">
        <div className="bg-sand-200 border-b border-sand-300 p-4">
          <h1 className="text-2xl font-bold text-brown-900">Verify Your Email</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium text-brown-800 mb-1">Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-sand-300 rounded bg-sand-50 focus:outline-none focus:border-brown-600 focus:ring-1 focus:ring-brown-600"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium text-brown-800 mb-1">Verification Code (6 digits):</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-sand-300 rounded bg-sand-50 focus:outline-none focus:border-brown-600 focus:ring-1 focus:ring-brown-600"
              />
            </div>
            {status && <div className="p-3 rounded bg-sand-200 text-brown-800 font-medium">{status}</div>}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 rounded text-sand-100 font-medium ${
                isLoading ? "bg-brown-600 cursor-not-allowed" : "bg-brown-800 hover:bg-brown-900"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-sand-100">
          <div className="animate-spin h-8 w-8 border-4 border-brown-800 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}

