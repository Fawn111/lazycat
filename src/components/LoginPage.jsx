import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/chat', { replace: true })
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bgblue.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      {/* Top-left logo */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[20px] font-bold tracking-widest text-white">Lazy Chat</span>
        </div>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl px-6 sm:px-8 py-8 sm:py-10">
          <h1 className="text-[28px] font-semibold text-gray-900 text-center mb-6">Log in</h1>

          <div className="flex flex-col gap-3 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] text-gray-900 placeholder-gray-400 text-[15px] outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] text-gray-900 placeholder-gray-400 text-[15px] outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
          </div>

          <button className="w-full py-3 rounded-xl bg-black text-white text-[15px] font-medium hover:bg-gray-800 transition mb-4">
            Log in
          </button>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 mb-5 text-[13px]">
            <Link to="/signup" className="text-[#6c5ce7] hover:underline">Sign Up</Link>
            <Link to="/forgot-password" className="text-[#6c5ce7] hover:underline">Forgot Password</Link>
            <a href="#" className="text-[#6c5ce7] hover:underline">Contact Us</a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[13px] text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social login buttons */}
          <div className="flex flex-col gap-3 mb-6">
            {error && (
              <p className="text-red-500 text-[13px] text-center">{error}</p>
            )}
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Log in with Google
            </button>

            {/* Microsoft */}
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition">
              <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Log in with Microsoft
            </button>

            {/* Apple */}
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition">
              <svg width="16" height="18" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.8 0 665.8 0 546.8 0 285 127.9 147.9 264.5 147.9c67.2 0 123.1 44.5 164.8 44.5 39.5 0 101.1-47.1 176.3-47.1 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              Log in with Apple
            </button>

            {/* Phone */}
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition">
              <svg width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.27.92Z"/>
              </svg>
              Log in with Phone
            </button>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-3 text-[12px] text-gray-400">
            <a href="#" className="hover:underline">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="py-4 text-center text-[12px] text-white/60">
        © 2025 Lazy Chat
      </div>
    </div>
  )
}
