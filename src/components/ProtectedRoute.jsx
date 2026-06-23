import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">

      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl">
          <span className="text-white text-[18px] font-bold tracking-tight">LC</span>
        </div>
        <div className="text-center">
          <p className="text-[20px] font-bold text-gray-900 tracking-tight">Lazy Chat</p>
          <p className="text-[13px] text-gray-400 mt-0.5">Getting things ready…</p>
        </div>
      </div>

      {/* Animated bar */}
      <div className="w-48 h-0.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full"
          style={{
            animation: 'loading-bar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (user === undefined) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return children
}
