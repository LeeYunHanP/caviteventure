"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("Signed out successfully!")
        router.push("/signin")
      } else {
        setStatus(data.message || "Sign out error.")
      }
    } catch (err) {
      console.error(err)
      setStatus("An error occurred during sign out.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="px-4 py-2 bg-[#8B4513] hover:bg-[#654321] text-[#f5f0e5] rounded-lg transition-all duration-200 font-medium shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#f5f0e5]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing Out...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </>
        )}
      </button>

      {status && (
        <div className="absolute top-full right-0 mt-2 w-full max-w-xs">
          <div className="bg-[#f5f0e5] border border-[#e6d7c3] text-[#654321] px-4 py-3 rounded-lg shadow-md text-sm">
            {status}
          </div>
        </div>
      )}
    </div>
  )
}

