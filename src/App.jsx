import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './components/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function GuestRoute({ children }) {
  const { user } = useAuth()
  // Show nothing while Firebase checks auth — prevents login page flash
  if (user === undefined) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl">
          <span className="text-white text-[18px] font-bold tracking-tight">LC</span>
        </div>
        <p className="text-[20px] font-bold text-gray-900 tracking-tight">Lazy Chat</p>
      </div>
      <div className="w-48 h-0.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900 rounded-full" style={{ animation: 'loading-bar 1.4s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes loading-bar { 0% { width:0%;margin-left:0% } 50% { width:60%;margin-left:20% } 100% { width:0%;margin-left:100% } }`}</style>
    </div>
  )
  if (user) return <Navigate to="/chat" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
