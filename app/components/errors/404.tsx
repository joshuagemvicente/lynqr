import { Sparkles, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in-up">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl animate-pulse opacity-20"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-thin text-gray-900 mb-6 tracking-tight">
            This feature
            <span className="block font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              isn&apos;t ready
            </span>
            <span className="block">yet</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light leading-relaxed max-w-lg mx-auto">
            We&apos;re putting the finishing touches on something extraordinary.
          </p>

          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 shadow-sm mb-12">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-medium">Available Soon</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-700 hover:bg-white/90 hover:border-gray-300/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Go Back</span>
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-8 font-light">
            Want to be notified when it&apos;s ready?{" "}
            <button className="text-blue-500 hover:text-blue-600 transition-colors underline underline-offset-2">
              Let us know
            </button>
          </p>
        </div>

        <div className="mt-20 animate-fade-in-up-delayed">
          <p className="text-sm text-gray-400 font-light">♡ by Gem.</p>
        </div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>

  )

}
