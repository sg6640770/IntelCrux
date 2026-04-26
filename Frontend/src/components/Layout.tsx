import React from 'react'
import { LogOut, User, Video } from 'lucide-react'
import toast from 'react-hot-toast'

interface LayoutProps {
  children: React.ReactNode
  mode: 'light' | 'dark'
  toggleMode: () => void
  onLogout?: () => void
  userEmail?: string | null
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  mode,
  toggleMode,
  onLogout,
  userEmail,
}) => {
  const isDark = mode === 'dark'

  const handleSignOut = () => {
    onLogout?.()
    toast.success('Signed out successfully!')
  }

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-[#042743] text-white'
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 text-black'
      }`}
    >
      <header
        className={`${
          isDark
            ? 'bg-[#033150] border-b border-blue-900 text-white'
            : 'bg-white/80 backdrop-blur-sm border-b border-white/20 text-gray-900'
        } sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-auto py-4 sm:py-0 sm:h-16">
            {/* Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                  YouTube Summarizer
                </h1>
                <p
                  className={`text-xs sm:text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  AI-powered video insights
                </p>
              </div>
            </div>

            {/* User Info + Sign Out + Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {userEmail && (
                <div
                  className={`flex items-center space-x-2 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="break-all">{userEmail}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {userEmail && onLogout && (
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-blue-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}

                <button
                  onClick={toggleMode}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Toggle {isDark ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
