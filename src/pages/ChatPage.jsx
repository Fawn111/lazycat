import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import ChatArea from '../components/ChatArea'
import ProfileModal from '../components/ProfileModal'
import { sendMessage, generateTitle } from '../services/openrouter'
import { needsWebSearch, webSearch, formatSearchContext } from '../services/tavily'
import {
  fetchChats, fetchChat, createChat,
  updateChat, deleteChat, appendMessages,
} from '../services/chatApi'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function ChatPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState({})   // { chatId: [{id, role, content, streaming}] }
  const [inputs, setInputs] = useState({})
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [loadingChats, setLoadingChats] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768)
  const [profileOpen, setProfileOpen] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  const abortRef = useRef(null)
  const email = user?.email

  // ── Load chats on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!email) return
    setLoadingChats(true)
    fetchChats(email)
      .then(data => {
        setChats(data)
        if (data.length > 0) setActiveChatId(data[0]._id)
      })
      .catch(() => setChats([]))
      .finally(() => setLoadingChats(false))
  }, [email])

  // ── Load messages when switching chats ──────────────────────────
  useEffect(() => {
    if (!activeChatId || !email) return
    if (messages[activeChatId]) return // already loaded
    fetchChat(email, activeChatId)
      .then(chat => {
        const msgs = (chat.messages ?? []).map(m => ({
          id: m._id ?? generateId(),
          role: m.role,
          content: m.content,
          streaming: false,
        }))
        setMessages(prev => ({ ...prev, [activeChatId]: msgs }))
      })
      .catch(() => {})
  }, [activeChatId, email])

  const activeChat = chats.find(c => c._id === activeChatId)
  const input = inputs[activeChatId] ?? ''
  const activeMessages = messages[activeChatId] ?? []

  // ── Chat CRUD ───────────────────────────────────────────────────
  async function handleNewChat() {
    const currentMsgs = messages[activeChatId] ?? []
    const currentChat = chats.find(c => c._id === activeChatId)
    if (currentChat?.title === 'New chat' && currentMsgs.length === 0) {
      return
    }
    const chat = await createChat(email)
    setChats(prev => [chat, ...prev])
    setActiveChatId(chat._id)
    setMessages(prev => ({ ...prev, [chat._id]: [] }))
    setInputs(prev => ({ ...prev, [chat._id]: '' }))
  }

  function handleSelectChat(id) {
    setActiveChatId(id)
  }

  async function handleDeleteChat(id) {
    await deleteChat(email, id).catch(() => {})
    setChats(prev => {
      const next = prev.filter(c => c._id !== id)
      if (id === activeChatId) {
        setActiveChatId(next[0]?._id ?? null)
      }
      return next
    })
    setMessages(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  async function handleStarChat(id) {
    const chat = chats.find(c => c._id === id)
    const starred = !chat?.starred
    await updateChat(email, id, { starred }).catch(() => {})
    setChats(prev => prev.map(c => c._id === id ? { ...c, starred } : c))
  }

  function handleRenameChat(id) {
    const chat = chats.find(c => c._id === id)
    setRenamingId(id)
    setRenameValue(chat?.title ?? '')
  }

  async function submitRename() {
    if (renameValue.trim()) {
      await updateChat(email, renamingId, { title: renameValue.trim() }).catch(() => {})
      setChats(prev => prev.map(c => c._id === renamingId ? { ...c, title: renameValue.trim() } : c))
    }
    setRenamingId(null)
    setRenameValue('')
  }

  function handleInputChange(value) {
    const id = activeChatId
    if (!id) return
    setInputs(prev => ({ ...prev, [id]: value }))
  }

  function handleStop() {
    abortRef.current?.abort()
  }

  // ── Smart auto-title ────────────────────────────────────────────
  async function autoTitle(chatId, history) {
    const title = await generateTitle(history).catch(() => null)
    if (title) {
      await updateChat(email, chatId, { title }).catch(() => {})
      setChats(prev => prev.map(c =>
        c._id === chatId && c.title === 'New chat' ? { ...c, title } : c
      ))
    }
  }

  // ── Stream helper — returns final assistant content ─────────────
  async function runStream(chatId, history, assistantMsgId, searchContext = null) {
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    let fullContent = ''

    try {
      await sendMessage(history, chunk => {
        fullContent += chunk
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId].map(m =>
            m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
          ),
        }))
      }, controller.signal, searchContext)
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errMsg = `Error: ${err.message}`
        fullContent = fullContent || errMsg
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId].map(m =>
            m.id === assistantMsgId
              ? { ...m, content: fullContent, streaming: false }
              : m
          ),
        }))
      }
    } finally {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).map(m =>
          m.id === assistantMsgId ? { ...m, streaming: false } : m
        ),
      }))
      abortRef.current = null
      setLoading(false)
    }

    return fullContent
  }

  // ── Send message ────────────────────────────────────────────────
  async function handleSend() {
    if (!input.trim() || loading || !activeChatId) return

    const userText = input.trim()
    const chatId = activeChatId
    const isFirst = (messages[chatId] ?? []).length === 0

    const userMsg = { id: generateId(), role: 'user', content: userText }
    const assistantMsgId = generateId()
    const assistantMsg = { id: assistantMsgId, role: 'assistant', content: '', streaming: true }

    const prevMsgs = messages[chatId] ?? []
    setMessages(prev => ({ ...prev, [chatId]: [...prevMsgs, userMsg, assistantMsg] }))
    setInputs(prev => ({ ...prev, [chatId]: '' }))

    const history = [...prevMsgs, userMsg].map(m => ({ role: m.role, content: m.content }))

    // Web search if needed
    let searchContext = null
    if (needsWebSearch(userText)) {
      setIsSearching(true)
      try {
        const searchData = await webSearch(userText)
        searchContext = formatSearchContext(searchData)
      } catch {
        // Search failed silently — continue without it
      } finally {
        setIsSearching(false)
      }
    }

    const assistantContent = await runStream(chatId, history, assistantMsgId, searchContext)

    await appendMessages(email, chatId, [
      { role: 'user', content: userText },
      { role: 'assistant', content: assistantContent },
    ]).catch(() => {})

    if (isFirst) autoTitle(chatId, history)
  }

  // ── Regenerate ──────────────────────────────────────────────────
  async function handleRegenerate() {
    if (loading || !activeChatId) return
    const chatId = activeChatId
    const msgs = messages[chatId] ?? []
    if (msgs.length === 0) return

    const trimmed = msgs[msgs.length - 1]?.role === 'assistant' ? msgs.slice(0, -1) : msgs
    const assistantMsgId = generateId()
    const assistantMsg = { id: assistantMsgId, role: 'assistant', content: '', streaming: true }

    setMessages(prev => ({ ...prev, [chatId]: [...trimmed, assistantMsg] }))

    const history = trimmed.map(m => ({ role: m.role, content: m.content }))
    const assistantContent = await runStream(chatId, history, assistantMsgId)

    await appendMessages(email, chatId, [
      { role: 'assistant', content: assistantContent },
    ]).catch(() => {})
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  // ── If no chats yet, create one ─────────────────────────────────
  useEffect(() => {
    if (!loadingChats && chats.length === 0 && email) {
      handleNewChat()
    }
  }, [loadingChats, chats.length, email])

  return (
    <div className="flex overflow-hidden bg-white" style={{ height: '100dvh' }}>

      <Sidebar
        user={user}
        chats={chats.map(c => ({ ...c, id: c._id }))}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onStarChat={handleStarChat}
        onRenameChat={handleRenameChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <TopBar
          user={user}
          chatTitle={activeChat?.title !== 'New chat' ? activeChat?.title : null}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onEditProfile={() => setProfileOpen(true)}
          onLogout={handleLogout}
        />
        <ChatArea
          user={user}
          input={input}
          onInputChange={handleInputChange}
          onSend={handleSend}
          onStop={handleStop}
          onRegenerate={handleRegenerate}
          messages={activeMessages}
          loading={loading}
          isSearching={isSearching}
        />
      </div>

      {profileOpen && (
        <ProfileModal user={user} onClose={() => setProfileOpen(false)} />
      )}

      {renamingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setRenamingId(null) }}
        >
          <div className="w-full max-w-[360px] bg-white rounded-2xl border border-gray-100 shadow-2xl p-6">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Rename chat</h3>
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') submitRename()
                if (e.key === 'Escape') setRenamingId(null)
              }}
              className="w-full px-4 py-2.5 rounded-xl text-[14px] text-gray-900 bg-gray-50 border border-gray-200 outline-none focus:border-gray-900 focus:bg-white transition mb-4"
            />
            <div className="flex gap-2.5">
              <button onClick={() => setRenamingId(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={submitRename} disabled={!renameValue.trim()} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white bg-gray-900 hover:bg-gray-700 transition disabled:opacity-40">
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
