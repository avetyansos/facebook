"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="mb-4">An error occurred while rendering this page.</p>
        <div className="space-x-4">
          <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Try again
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

