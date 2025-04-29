"use client"

import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { url } from "../App"
import { toast } from "react-toastify"
import { useCookies } from "react-cookie"
import { Music, X, Upload, ImageIcon } from 'lucide-react'

const CreatePlaylistPage = () => {
  const navigate = useNavigate()
  const [cookies] = useCookies(["token"])
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Animation effect
  useEffect(() => {
    const form = formRef.current
    if (form) {
      form.style.opacity = "0"
      form.style.transform = "translateY(20px)"

      setTimeout(() => {
        form.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
        form.style.opacity = "1"
        form.style.transform = "translateY(0)"
      }, 300)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Playlist name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
        const token = cookies.token
        const formDataToSend = new FormData()
        formDataToSend.append("name", formData.name)
        formDataToSend.append("desc", formData.description)
        formDataToSend.append("image", coverImage)
        formDataToSend.append("songs", JSON.stringify([]))

        const response = await axios.post(`${url}/api/playlist/create`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success) {
          toast.success("Playlist created successfully")
          navigate("/home")
        } else {
          toast.error("Something went wrong")
        }
      } catch (error) {
        console.error("Error creating Playlist:", error)
        toast.error("Error occurred")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwVjBoLTMwdjMwek0wIDMwaDMwdjMwSDB2LTMweiIgZmlsbD0iI2ZmZmZmZjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      <div
        ref={formRef}
        className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(134,25,143,0.15)] overflow-hidden border border-white/10 relative z-10"
      >
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-600 blur-lg opacity-70 animate-pulse"></div>
              <div className="relative bg-gradient-to-tr from-fuchsia-600 to-violet-700 w-16 h-16 rounded-full flex items-center justify-center shadow-xl">
                <Music className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create New Playlist</h2>

          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Cover Image Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div
                onClick={triggerFileInput}
                className="w-48 h-48 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors mb-2 overflow-hidden group relative"
              >
                {coverImagePreview ? (
                  <>
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md p-2 rounded-full">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-fuchsia-500/20 p-4 rounded-full mb-3">
                      <Upload className="h-8 w-8 text-fuchsia-300" />
                    </div>
                    <p className="text-fuchsia-200 font-medium">Choose image</p>
                    <p className="text-fuchsia-200/60 text-sm mt-1">or drag and drop</p>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <p className="text-xs text-fuchsia-200/60">Recommended: 300 x 300 pixels</p>
            </div>

            {/* Playlist Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-fuchsia-100 mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-3 bg-white/5 border ${
                  errors.name ? "border-red-500/50" : "border-fuchsia-500/20"
                } text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent focus:outline-none transition-colors`}
                placeholder="My Awesome Playlist"
              />
              {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-fuchsia-100 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 bg-white/5 border border-fuchsia-500/20 text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent focus:outline-none transition-colors resize-none"
                placeholder="Add an optional description"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-4 py-2 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-black bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                    Creating...
                  </div>
                ) : (
                  "Create Playlist"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePlaylistPage
