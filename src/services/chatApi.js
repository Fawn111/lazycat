const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'

export async function fetchChats(email) {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Failed to fetch chats')
  return res.json()
}

export async function fetchChat(email, chatId) {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}/${chatId}`)
  if (!res.ok) throw new Error('Failed to fetch chat')
  return res.json()
}

export async function createChat(email, title = 'New chat') {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to create chat')
  return res.json()
}

export async function updateChat(email, chatId, updates) {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}/${chatId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update chat')
  return res.json()
}

export async function deleteChat(email, chatId) {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}/${chatId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete chat')
  return res.json()
}

export async function appendMessages(email, chatId, messages) {
  const res = await fetch(`${BASE}/chats/${encodeURIComponent(email)}/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error('Failed to save messages')
  return res.json()
}
