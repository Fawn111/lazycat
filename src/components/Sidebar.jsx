import { useState, useRef, useEffect } from 'react'

function ChatItemMenu({ chatId, isStarred, onStar, onRename, onDelete, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-7 w-44 rounded-xl bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
      <button onClick={() => { onStar(chatId); onClose() }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition flex items-center gap-2.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill={isStarred ? '#f59e0b' : 'none'} stroke={isStarred ? '#f59e0b' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {isStarred ? 'Unstar' : 'Star'}
      </button>
      <button onClick={() => { onRename(chatId); onClose() }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition flex items-center gap-2.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Rename
      </button>
      <div className="border-t border-gray-100" />
      <button onClick={() => { onDelete(chatId); onClose() }} className="w-full text-left px-3.5 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition flex items-center gap-2.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        Delete
      </button>
    </div>
  )
}

function ChatItem({ chat, isActive, onSelect, onStar, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className={`group relative flex items-center rounded-lg transition ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
      {chat.starred && (
        <svg className="ml-2 shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )}
      <button onClick={() => onSelect(chat.id)} className={`flex-1 text-left px-3 py-2.5 text-[13px] truncate transition ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'} ${chat.starred ? 'pl-1.5' : ''}`}>
        {chat.title}
      </button>
      <div className="relative shrink-0">
        <button onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }} className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          </svg>
        </button>
        {menuOpen && <ChatItemMenu chatId={chat.id} isStarred={chat.starred} onStar={onStar} onRename={onRename} onDelete={onDelete} onClose={() => setMenuOpen(false)} />}
      </div>
    </div>
  )
}

export default function Sidebar({ user, chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onStarChat, onRenameChat, open, onClose }) {
  const firstName = user?.displayName?.split(' ')[0] ?? 'there'
  const starred = chats.filter(c => c.starred)
  const recent = chats.filter(c => !c.starred)

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar — overlay on mobile, inline on desktop */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-auto
        flex flex-col shrink-0 bg-white border-r border-gray-100
        transition-transform duration-300 ease-in-out
        w-[280px] md:w-[260px]
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-0'}
      `}>
        <div className="flex flex-col h-full w-[280px] md:w-[260px]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-gray-900">Lazy Chat</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* New chat */}
          <div className="px-3 pt-3 pb-1">
            <button onClick={onNewChat} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-gray-200 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New chat
            </button>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">
            {starred.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest px-2 mb-1.5 font-semibold text-gray-300">Starred</p>
                <div className="flex flex-col gap-0.5">
                  {starred.map(chat => <ChatItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onSelect={id => { onSelectChat(id); onClose() }} onStar={onStarChat} onRename={onRenameChat} onDelete={onDeleteChat} />)}
                </div>
              </div>
            )}
            {recent.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest px-2 mb-1.5 font-semibold text-gray-300">Recent</p>
                <div className="flex flex-col gap-0.5">
                  {recent.map(chat => <ChatItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onSelect={id => { onSelectChat(id); onClose() }} onStar={onStarChat} onRename={onRenameChat} onDelete={onDeleteChat} />)}
                </div>
              </div>
            )}
            {chats.length === 0 && <p className="text-[12px] text-gray-300 px-2">No chats yet. Start one!</p>}
          </div>

          {/* User footer */}
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0 ring-2 ring-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[12px] font-bold text-white shrink-0">{firstName[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{user?.displayName}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
