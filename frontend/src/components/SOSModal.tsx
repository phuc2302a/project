import React, { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, Send, UserPlus, Trash2 } from 'lucide-react'
import type { ContactPerson } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  suspectInfo?: string
}

export const SOSModal: React.FC<Props> = ({ isOpen, onClose, suspectInfo = '' }) => {
  const { isElderMode } = useElderMode()

  // Danh bạ người thân lưu trong LocalStorage
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
      { name: 'Con trai', phone: '0912345678', relationship: 'Con cái' },
      { name: 'Con gái', phone: '0987654321', relationship: 'Con cái' }
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
    ? `Bố/mẹ nhận được thông tin nghi ngờ này: "${suspectInfo}". Con kiểm tra giúp bố/mẹ với, có phải lừa đảo không?`
    : `Bố/mẹ vừa nhận được một cuộc gọi/tin nhắn lạ yêu cầu chuyển tiền. Con gọi lại cho bố/mẹ ngay nhé!`

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
    // Mở Zalo chat
    window.open(`https://zalo.me/${selectedPhone.replace(/^0/, '84')}`, '_blank')
  }

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim()) return
    const updated = [...contacts, { name: newName, phone: newPhone, relationship: newRel || 'Người thân' }]
    setContacts(updated)
    setSelectedPhone(newPhone)
    setNewName('')
    setNewPhone('')
    setNewRel('')
    setShowAddForm(false)
  }

  const handleDeleteContact = (phoneToDelete: string) => {
    const updated = contacts.filter(c => c.phone !== phoneToDelete)
    setContacts(updated)
    if (selectedPhone === phoneToDelete && updated.length > 0) {
      setSelectedPhone(updated[0].phone)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all ${isElderMode ? 'text-xl' : 'text-base'}`}>
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <Phone className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className={`font-bold text-red-700 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                Hỏi ý kiến người thân
              </h2>
              <p className="text-sm text-gray-500">Gửi nhanh thông tin nghi ngờ cho con cái trước khi chuyển tiền</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nội dung tin nhắn chuẩn bị gửi */}
        <div className="my-4 rounded-xl bg-amber-50 p-4 border border-amber-200">
          <p className="font-semibold text-amber-900 mb-1">Nội dung sẽ gửi:</p>
          <p className="text-gray-800 italic bg-white p-3 rounded-lg border border-amber-100">
            "{messageText}"
          </p>
        </div>

        {/* Chọn người thân */}
        <div className="mb-4">
          <label className="block font-bold text-gray-800 mb-2">
            Chọn người thân nhận tin:
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {contacts.map((contact) => (
              <label
                key={contact.phone}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  selectedPhone === contact.phone
                    ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="contact"
                    checked={selectedPhone === contact.phone}
                    onChange={() => setSelectedPhone(contact.phone)}
                    className="h-5 w-5 text-red-600 accent-red-600"
                  />
                  <div>
                    <div>{contact.name} ({contact.relationship})</div>
                    <div className="text-sm text-gray-500 font-normal">{contact.phone}</div>
                  </div>
                </div>
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteContact(contact.phone)
                    }}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Xóa người này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </label>
            ))}
          </div>

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              <UserPlus className="w-4 h-4" /> Thêm người thân khác
            </button>
          ) : (
            <form onSubmit={handleAddContact} className="mt-3 p-3 bg-gray-50 rounded-xl border space-y-2">
              <input
                type="text"
                placeholder="Tên (VD: Con trai, Cháu Nam)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Lưu liên hệ
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Các nút hành động khẩn cấp */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <button
            onClick={handleCall}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all ${
              isElderMode ? 'p-4 text-xl font-bold' : 'p-3 text-sm font-semibold'
            }`}
          >
            <Phone className="h-6 w-6" />
            <span>Gọi ngay</span>
          </button>

          <button
            onClick={handleZalo}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all ${
              isElderMode ? 'p-4 text-xl font-bold' : 'p-3 text-sm font-semibold'
            }`}
          >
            <Send className="h-6 w-6" />
            <span>Gửi Zalo</span>
          </button>

          <button
            onClick={handleSMS}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all ${
              isElderMode ? 'p-4 text-xl font-bold' : 'p-3 text-sm font-semibold'
            }`}
          >
            <MessageSquare className="h-6 w-6" />
            <span>Gửi SMS</span>
          </button>
        </div>
      </div>
    </div>
  )
}
