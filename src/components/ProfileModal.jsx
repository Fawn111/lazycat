import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

const PROFILE_PICS = [
  '/profilepics/1.png',
  '/profilepics/2.png',
  '/profilepics/3.jpeg',
  '/profilepics/4.png',
  '/profilepics/5.jpeg',
  '/profilepics/6.jpeg',
  '/profilepics/7.png',
  '/profilepics/8.jpeg',
  '/profilepics/9.png',
  '/profilepics/10.jpeg',
  '/profilepics/11.jpeg',
]

export default function ProfileModal({ user, onClose }) {
  const [name, setName] = useState(user?.displayName ?? '')
  const [selectedPic, setSelectedPic] = useState(user?.photoURL ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
        photoURL: selectedPic || user?.photoURL,
      })
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 800)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[460px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition p-1.5 rounded-lg"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {selectedPic ? (
                <img src={selectedPic} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-white">
                  {name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-900">{name || 'Your name'}</p>
              <p className="text-[12px] text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl text-[14px] text-gray-900 outline-none bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white transition"
            />
          </div>

          {/* Avatar grid */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 block">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PROFILE_PICS.map(pic => (
                <button
                  key={pic}
                  onClick={() => setSelectedPic(pic)}
                  className="relative rounded-full overflow-hidden transition"
                  style={{
                    width: '48px', height: '48px',
                    outline: selectedPic === pic ? '3px solid #111827' : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                >
                  <img src={pic} alt="" className="w-full h-full object-cover" />
                  {selectedPic === pic && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
              {/* No avatar / initials */}
              <button
                onClick={() => setSelectedPic('')}
                className="rounded-full flex items-center justify-center bg-gray-100 border-2 transition"
                style={{
                  width: '48px', height: '48px',
                  borderColor: selectedPic === '' ? '#111827' : '#e5e7eb',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: saved ? '#16a34a' : '#111827' }}
            >
              {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
