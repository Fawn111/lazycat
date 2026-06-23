import { useState, useRef, useEffect } from 'react'

export default function TopBar({ user, chatTitle, sidebarOpen, onToggleSidebar, onEditProfile, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const firstName = user?.displayName?.split(' ')[0] ?? 'there'

  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-3 bg-white border-b border-gray-100 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition shrink-0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="text-[13px] font-medium text-gray-400 select-none truncate max-w-[120px] sm:max-w-[260px] md:max-w-[400px]">
          {chatTitle || 'New conversation'}
        </span>
      </div>

      {/* Right — profile */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-2 ring-gray-200" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-[12px] font-bold text-white">
              {firstName[0]}
            </div>
          )}
          {/* Hide name on very small screens */}
          <span className="hidden sm:block text-[13px] font-medium text-gray-800 max-w-[120px] truncate">
            {user?.displayName}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1.5 w-52 rounded-2xl overflow-hidden z-50 bg-white border border-gray-100 shadow-xl">
            <div className="px-4 py-3.5 border-b border-gray-100">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full mb-2 ring-2 ring-gray-200" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-[13px] font-bold text-white mb-2">
                  {firstName[0]}
                </div>
              )}
              <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.displayName}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={() => { setMenuOpen(false); onEditProfile() }} className="w-full text-left px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Edit profile
            </button>
            <button onClick={() => { setMenuOpen(false); onLogout() }} className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition flex items-center gap-2.5 border-t border-gray-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
