import React, { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, Send, UserPlus, Trash2, ShieldAlert, HeartHandshake } from 'lucide-react'
import type { ContactPerson } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  suspectInfo?: string
}

export const SOSModal: React.FC<Props> = ({ isOpen, onClose, suspectInfo = '' }) => {
  const { isElderMode } = useElderMode()

  const [contacts, setContacts] = useState<ContactPerson[]>(() => {
    const saved = localStorage.getItem('la_chan_so_sos_contacts')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return [
      { name: 'Con trai (Tuấn)', phone: '0912345678', relationship: 'Con trai' },
      { name: 'Con gái (Mai)', phone: '0987654321', relationship: 'Con gái' }
    ]
  })

  const [selectedPhone, setSelectedPhone] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRel, setNewRel] = useState('')

  useEffect(() => {
    if (contacts.length > 0 && !selectedPhone) {
      setSelectedPhone(contacts[0].phone)
    }
    localStorage.setItem('la_chan_so_sos_contacts', JSON.stringify(contacts))
  }, [contacts, selectedPhone])

  if (!isOpen) return null

  const messageText = suspectInfo
    ? `Bố/mẹ vừa nhận được thông tin nghi ngờ lừa đảo này: "${suspectInfo}". Con kiểm tra giúp bố/mẹ với, có phải lừa đảo không? Tuyệt đối không để bố/mẹ chuyển tiền một mình nhé!`
    : `Bố/mẹ vừa nhận được cuộc gọi/tin nhắn lạ yêu cầu chuyển tiền gấp. Con gọi lại cho bố/mẹ ngay để kiểm tra nhé!`

  const handleCall = () => {
    if (!selectedPhone) return
    window.location.href = `tel:${selectedPhone}`
  }

  const handleSMS = () => {
    if (!selectedPhone) return
    window.location.href = `sms:${selectedPhone}?body=${encodeURIComponent(messageText)}`
  }

  const handleZalo = () => {
    if (!selectedPhone) return
    window.open(`https://zalo.me/${selectedPhone.replace(/^0/, '84')}`, '_blank')
  }

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim()) return
    const updated = [
      ...contacts,
      { name: newName.trim(), phone: newPhone.trim(), relationship: newRel.trim() || 'Người thân' }
    ]
    setContacts(updated)
    setSelectedPhone(newPhone.trim())
    setNewName('')
    setNewPhone('')
    setNewRel('')
    setShowAddForm(false)
  }

  const handleDeleteContact = (phoneToDelete: string) => {
    const updated = contacts.filter((c) => c.phone !== phoneToDelete)
    setContacts(updated)
    if (selectedPhone === phoneToDelete && updated.length > 0) {
      setSelectedPhone(updated[0].phone)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-lg bg-[#0e0e11] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950 border border-rose-800 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Hỏi Ý Kiến Người Thân (SOS)
              </h3>
              <p className="text-xs text-neutral-400">Bình tĩnh, không chuyển tiền một mình. Hỏi con cháu trước!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Reassuring Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-900/60 text-amber-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Kẻ xấu thường hối thúc để bạn không kịp hỏi ai. Chỉ cần dừng lại 1 phút hỏi con cháu là an toàn!</span>
          </div>

          {/* Contact Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-neutral-500">
                Chọn người thân muốn liên lạc:
              </label>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Đóng' : '+ Thêm số người thân'}</span>
              </button>
            </div>

            {/* List Contacts */}
            <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
              {contacts.map((c) => {
                const isSelected = selectedPhone === c.phone
                return (
                  <div
                    key={c.phone}
                    onClick={() => setSelectedPhone(c.phone)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-neutral-600 bg-neutral-900 text-white'
                        : 'border-neutral-800/80 bg-[#141418] text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-white bg-white' : 'border-neutral-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          <span>{c.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {c.relationship}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">{c.phone}</div>
                      </div>
                    </div>

                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteContact(c.phone)
                        }}
                        className="text-neutral-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Form thêm số mới */}
            {showAddForm && (
              <form onSubmit={handleAddContact} className="mt-3 p-3.5 bg-[#141418] rounded-xl border border-neutral-800 space-y-2">
                <div className="text-xs text-neutral-400">Lưu số con cháu:</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Tên (VD: Con trai Nam)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                  <input
                    placeholder="Số điện thoại"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
                <button type="submit" className="w-full text-xs font-semibold bg-white text-black py-2 rounded-lg hover:bg-neutral-200">
                  Lưu số này
                </button>
              </form>
            )}
          </div>

          {/* Pre-written message */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-neutral-800/80 text-xs text-neutral-400">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
              Tin nhắn gửi đi:
            </span>
            <p className="italic text-zinc-300">&quot;{messageText}&quot;</p>
          </div>

          {/* 3 Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleCall}
              disabled={!selectedPhone}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-40"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi điện</span>
            </button>

            <button
              type="button"
              onClick={handleSMS}
              disabled={!selectedPhone}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-40"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gửi SMS</span>
            </button>

            <button
              type="button"
              onClick={handleZalo}
              disabled={!selectedPhone}
              className="py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>Gửi qua Zalo</span>
            </button>
          </div>

          {/* Hotline Trực ban Công an */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
            <span>Hoặc gọi Trực ban Công an Đồng Nai:</span>
            <a href="tel:0693480113" className="font-mono font-bold text-rose-400 hover:underline">
              0693.480.113
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
