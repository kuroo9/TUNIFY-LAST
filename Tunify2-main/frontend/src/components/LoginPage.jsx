"use client"

import { useState, useEffect, createContext, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { UserData } from "../context/User"
import { Music, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"

export const UserContext = createContext()

const LoginPage = () => {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const { isAuth, loginUser } = UserData()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Animation states
  const [animateWave, setAnimateWave] = useState(false)

  useEffect(() => {
    // Start animation after component mounts
    setAnimateWave(true)

    // Animate form entrance
    const form = formRef.current
    if (form) {
      form.style.opacity = "0"
      form.style.transform = "translateY(20px)"

      setTimeout(() => {
        form.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
        form.style.opacity = "1"
        form.style.transform = "translateY(0)"
        setTimeout(() => setAnimationComplete(true), 800)
      }, 300)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        await loginUser(formData.email, formData.password, navigate)
        console.log(isAuth)
      } catch (error) {
        console.error("Error during login:", error)
        toast.error("Login failed. Please check your credentials.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated wave bars */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20">
          <div className={`flex justify-around items-end h-full ${animateWave ? "animate-wave" : ""}`}>
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t-full bg-gradient-to-t from-fuchsia-400 to-violet-500"
                style={{
                  height: `${Math.random() * 70 + 30}%`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${Math.random() * 1.5 + 1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iI2ZmZmZmZjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-fuchsia-200/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Logo */}
      <div className="mb-8 flex items-center justify-center relative z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-600 blur-lg opacity-70 animate-pulse"></div>
          <div className="relative bg-gradient-to-tr from-fuchsia-600 to-violet-700 w-16 h-16 rounded-full flex items-center justify-center shadow-xl">
            <Music className="h-8 w-8 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white ml-3 bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-white animate-gradient-x">
          Tunify
        </h1>
      </div>

      {/* Login Form */}
      <div
        ref={formRef}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(134,25,143,0.15)] overflow-hidden border border-white/10 relative z-10"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Log in to continue</h2>

          {errors.general && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-fuchsia-100 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 bg-white/5 border ${errors.email ? "border-red-500/50" : "border-fuchsia-500/20"} text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent focus:outline-none transition-colors`}
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-fuchsia-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 bg-white/5 border ${errors.password ? "border-red-500/50" : "border-fuchsia-500/20"} text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent focus:outline-none transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-fuchsia-300/60 hover:text-fuchsia-200 transition-colors"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-black bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3 text-black" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Section */}
        <div className="px-8 py-6 bg-black/30 border-t border-white/5">
          <p className="text-center text-sm text-fuchsia-200/70">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Add this to your CSS or in a style tag */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            height: 30%;
          }
          50% {
            height: 70%;
          }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-wave div {
          animation: wave 2s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginPage