import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const SUGGESTIONS = [
  { icon: '✍️', label: 'Write a short story', sub: 'Creative fiction, any genre', prompt: 'Write me a short story' },
  { icon: '🧠', label: 'Explain quantum computing', sub: 'Simple, clear breakdown', prompt: 'Explain quantum computing simply' },
  { icon: '🐛', label: 'Help debug my code', sub: 'Paste your code & error', prompt: 'Help me debug my code' },
  { icon: '🗺️', label: 'Plan a trip to Tokyo', sub: '3-day itinerary', prompt: 'Plan a 3-day trip to Tokyo' },
]

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-[22px] font-bold text-gray-900 mt-5 mb-2 pb-2 border-b border-gray-100">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[18px] font-bold text-gray-900 mt-5 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[16px] font-bold text-gray-800 mt-4 mb-1.5">{children}</h3>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
  p: ({ children }) => (
    <p className="mb-3.5 last:mb-0 leading-[1.85] text-gray-700 text-[15px]">{children}</p>
  ),
  ul: ({ children }) => <ul className="mb-3.5 space-y-2 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3.5 space-y-2 pl-1">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-3 leading-[1.8] text-gray-700 text-[15px]">
      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
      <span>{children}</span>
    </li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-gray-200">
        {children}
      </code>
    ) : (
      <div className="my-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
          <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wider">code</span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
        </div>
        <pre className="bg-gray-950 text-gray-100 px-4 py-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
          <code>{children}</code>
        </pre>
      </div>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-gray-300 pl-4 py-1 my-3 text-gray-500 italic bg-gray-50 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-100 my-5" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-gray-900 font-medium underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900 transition">
      {children}
    </a>
  ),
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
      title="Copy"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

function Message({ msg, user, onRegenerate, isLast }) {
  const isUser = msg.role === 'user'
  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'Y'

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start group`}>

      {/* Avatar */}
      {isUser ? (
        user?.photoURL ? (
          <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5 ring-2 ring-white shadow-md object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full shrink-0 bg-gray-900 flex items-center justify-center text-[12px] font-bold text-white mt-0.5 ring-2 ring-white shadow-md">
            {initial}
          </div>
        )
      ) : (
        <div className="w-8 h-8 rounded-full shrink-0 bg-gray-900 flex items-center justify-center text-[11px] font-bold text-white mt-0.5 shadow-md">
          LC
        </div>
      )}

      {/* Content */}
      <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[78%]`}>
        <div className={`text-[15px] leading-relaxed ${
          isUser
            ? 'bg-gray-900 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-md'
            : 'text-gray-800 px-1 py-1'
        }`}>
          {isUser ? (
            <span className="whitespace-pre-wrap leading-[1.8]">{msg.content}</span>
          ) : (
            <div>
              {msg.content ? (
                <ReactMarkdown components={markdownComponents}>
                  {msg.content}
                </ReactMarkdown>
              ) : null}
              {msg.streaming && !msg.content && (
                <div className="flex gap-1.5 py-2 px-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              )}
              {msg.streaming && msg.content && (
                <span className="inline-block w-1.5 h-[16px] bg-gray-400 rounded-sm ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Action buttons — only on AI messages when done */}
        {!isUser && !msg.streaming && msg.content && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={msg.content} />
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                title="Regenerate"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatArea({ user, input, onInputChange, onSend, onStop, onRegenerate, messages, loading }) {
  const firstName = user?.displayName?.split(' ')[0] ?? 'there'
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !loading) onSend()
    }
  }

  const isEmpty = !messages || messages.length === 0
  const lastAssistantIdx = messages
    ? [...messages].reverse().findIndex(m => m.role === 'assistant')
    : -1
  const lastAssistantId = lastAssistantIdx >= 0
    ? messages[messages.length - 1 - lastAssistantIdx]?.id
    : null

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-[#f9f9f9]" style={{ minHeight: 0 }}>

      {/* Messages / empty state */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-6 sm:py-8">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-full pb-4 sm:pb-6 px-2">
            <div className="relative mb-5 sm:mb-6">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-gray-900 scale-[2]" />
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-2xl">
                <span className="text-white text-[14px] sm:text-[18px] font-bold tracking-tight">LC</span>
              </div>
            </div>
            <h1 className="text-[22px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-1.5 text-center">
              Hey, {firstName} 👋
            </h1>
            <p className="text-[13px] sm:text-[15px] text-gray-400 mb-6 sm:mb-10 text-center font-normal">
              I'm Lazy Chat — ask me anything.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-[560px]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => onInputChange(s.prompt)}
                  className="group relative text-left px-4 py-3 sm:py-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                  <span className="text-[18px] sm:text-[22px] mb-1.5 sm:mb-2.5 block">{s.icon}</span>
                  <span className="block text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 mb-0.5 leading-snug">{s.label}</span>
                  <span className="block text-[11px] text-gray-400 transition">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[760px] mx-auto flex flex-col gap-5 sm:gap-7">
            {messages.map(msg => (
              <Message key={msg.id} msg={msg} user={user} onRegenerate={msg.id === lastAssistantId ? onRegenerate : null} isLast={msg.id === lastAssistantId} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar — always visible, safe area aware */}
      <div
        className="shrink-0 bg-white border-t border-gray-100 px-3 sm:px-4 pt-2.5 sm:pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 shadow-sm focus-within:border-gray-400 focus-within:shadow-md transition-all">
            <textarea
              rows={1}
              placeholder="Ask me anything…"
              value={input}
              onChange={e => {
                onInputChange(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-300 outline-none resize-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: '120px', minHeight: '24px', fontSize: '16px' }}
            />
            {loading ? (
              <button
                onClick={onStop}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </button>
            ) : (
              <button
                disabled={!input.trim()}
                onClick={onSend}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gray-900 text-white hover:bg-gray-700 transition disabled:opacity-25 disabled:cursor-not-allowed shadow-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
