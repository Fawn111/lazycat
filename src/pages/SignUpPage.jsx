import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <svg width="28" height="28" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.131-3.586 10.078 10.078 0 0 0-11.183 4.418 9.964 9.964 0 0 0-3.244 5.731 10.078 10.078 0 0 0 1.244 7.529 9.964 9.964 0 0 0 .856 8.185 10.078 10.078 0 0 0 10.855 4.835 9.964 9.964 0 0 0 6.131 3.586 10.078 10.078 0 0 0 11.184-4.418 9.964 9.964 0 0 0 3.243-5.732 10.078 10.078 0 0 0-1.244-7.528ZM20.5 37.796a7.474 7.474 0 0 1-4.8-1.73l.237-.134 7.964-4.6a1.305 1.305 0 0 0 .655-1.134v-11.23l3.365 1.944a.12.12 0 0 1 .066.092v9.3a7.505 7.505 0 0 1-7.487 7.492Zm-16.025-6.873a7.474 7.474 0 0 1-.894-5.023l.237.143 7.964 4.6a1.305 1.305 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.746Zm-2.087-17.43a7.474 7.474 0 0 1 3.905-3.292V19.2a1.305 1.305 0 0 0 .654 1.132l9.723 5.614-3.365 1.944a.12.12 0 0 1-.114.012L4.677 23.014a7.505 7.505 0 0 1-2.289-9.522Zm27.658 6.437-9.724-5.615 3.365-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.015a1.305 1.305 0 0 0-.645-1.591Zm3.35-5.043-.236-.144-7.965-4.6a1.307 1.307 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.766Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756l-.236.134-7.965 4.6a1.305 1.305 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.498v4.997l-4.331 2.5-4.331-2.5V18.873Z" fill="currentColor"/>
          </svg>
          <span className="text-[15px] font-semibold text-gray-900">Lazy Chat</span>
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px]">
          <h1 className="text-[28px] font-semibold text-gray-900 text-center mb-6">Create account</h1>

          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] text-gray-900 placeholder-gray-400 text-[15px] outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
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
            Create account
          </button>

          <p className="text-center text-[13px] text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6c5ce7] hover:underline">Log in</Link>
          </p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[13px] text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition">
              <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Sign up with Microsoft
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-[12px] text-gray-400">
            <a href="#" className="hover:underline">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-[12px] text-gray-400">
        © 2025 Lazy Chat
      </div>
    </div>
  )
}
