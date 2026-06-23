import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email) setSent(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <svg width="28" height="28" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.131-3.586 10.078 10.078 0 0 0-11.183 4.418 9.964 9.964 0 0 0-3.244 5.731 10.078 10.078 0 0 0 1.244 7.529 9.964 9.964 0 0 0 .856 8.185 10.078 10.078 0 0 0 10.855 4.835 9.964 9.964 0 0 0 6.131 3.586 10.078 10.078 0 0 0 11.184-4.418 9.964 9.964 0 0 0 3.243-5.732 10.078 10.078 0 0 0-1.244-7.528ZM20.5 37.796a7.474 7.474 0 0 1-4.8-1.73l.237-.134 7.964-4.6a1.305 1.305 0 0 0 .655-1.134v-11.23l3.365 1.944a.12.12 0 0 1 .066.092v9.3a7.505 7.505 0 0 1-7.487 7.492Zm-16.025-6.873a7.474 7.474 0 0 1-.894-5.023l.237.143 7.964 4.6a1.305 1.305 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.746Zm-2.087-17.43a7.474 7.474 0 0 1 3.905-3.292V19.2a1.305 1.305 0 0 0 .654 1.132l9.723 5.614-3.365 1.944a.12.12 0 0 1-.114.012L4.677 23.014a7.505 7.505 0 0 1-2.289-9.522Zm27.658 6.437-9.724-5.615 3.365-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.015a1.305 1.305 0 0 0-.645-1.591Zm3.35-5.043-.236-.144-7.965-4.6a1.307 1.307 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.766Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756l-.236.134-7.965 4.6a1.305 1.305 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.498v4.997l-4.331 2.5-4.331-2.5V18.873Z" fill="currentColor"/>
          </svg>
          <span className="text-[15px] font-semibold text-gray-900">Lazy Chat</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px]">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 className="text-[24px] font-semibold text-gray-900 mb-2">Check your email</h1>
              <p className="text-[14px] text-gray-500 mb-6">
                We sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
              </p>
              <Link to="/login" className="text-[13px] text-[#6c5ce7] hover:underline">
                ← Back to log in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-[28px] font-semibold text-gray-900 text-center mb-2">Reset password</h1>
              <p className="text-[14px] text-gray-500 text-center mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] text-gray-900 placeholder-gray-400 text-[15px] outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-black text-white text-[15px] font-medium hover:bg-gray-800 transition"
                >
                  Send reset link
                </button>
              </form>
              <p className="text-center text-[13px] text-gray-500 mt-4">
                <Link to="/login" className="text-[#6c5ce7] hover:underline">← Back to log in</Link>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="py-4 text-center text-[12px] text-gray-400">
        © 2025 Lazy Chat
      </div>
    </div>
  )
}
