import type React from "react"

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export function SimpleButton({ children, variant = "default", className = "", ...props }: SimpleButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium"
  const variantStyles =
    variant === "default" ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 hover:bg-gray-100"

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  )
}

