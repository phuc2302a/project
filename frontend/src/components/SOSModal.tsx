import React, { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, Send, UserPlus, Trash2, ShieldAlert } from 'lucide-react'
import type { ContactPerson } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'

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
    ? `Bố/mẹ vừa nhận được thông tin nghi ngờ này: "${suspectInfo}". Con kiểm tra giúp bố/mẹ với, có phải lừa đảo không?`
    : `Bố/mẹ vừa nhận được cuộc gọi/tin nhắn lạ yêu cầu chuyển tiền gấp. Con gọi lại cho bố/mẹ ngay nhé!`

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
    const updated = [...contacts, { name: newName.trim(), phone: newPhone.trim(), relationship: newRel.trim() || 'Người thân' }]
    setContacts(updated)
    setSelectedPhone(newPhone.trim())
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className={`w-full max-w-lg border-slate-200 shadow-2xl ${isElderMode ? 'text-xl' : 'text-base'}`}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className={`text-slate-900 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
                Hỏi ý kiến người thân
              </CardTitle>
              <p className="text-xs text-slate-500">Xác nhận an toàn với gia đình trước khi chuyển tiền</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Message Preview */}
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Nội dung gửi nhanh:
            </span>
            <p className="text-sm font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 italic">
              "{messageText}"
            </p>
          </div>

          {/* Contact Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Chọn người nhận tin:
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {contacts.map((contact) => (
                <label
                  key={contact.phone}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPhone === contact.phone
                      ? 'border-slate-900 bg-slate-900/5 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sos-contact"
                      checked={selectedPhone === contact.phone}
                      onChange={() => setSelectedPhone(contact.phone)}
                      className="h-4 w-4 accent-slate-900"
                    />
                    <div>
                      <div className="text-sm">{contact.name} <span className="text-xs font-normal text-slate-500">({contact.relationship})</span></div>
                      <div className="text-xs text-slate-500 font-mono">{contact.phone}</div>
                    </div>
                  </div>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteContact(contact.phone)
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                      title="Xóa liên hệ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </label>
              ))}
            </div>

            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Thêm người thân khác
              </button>
            ) : (
              <form onSubmit={handleAddContact} className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <Input
                  type="text"
                  placeholder="Tên (VD: Con trai, Cháu Nam)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="h-7 text-xs"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    Lưu
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCall}
              className="flex-col h-auto py-2.5 gap-1 rounded-xl shadow-xs"
            >
              <Phone className="h-5 w-5" />
              <span className="text-xs font-bold">Gọi ngay</span>
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={handleZalo}
              className="flex-col h-auto py-2.5 gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xs"
            >
              <Send className="h-5 w-5" />
              <span className="text-xs font-bold">Gửi Zalo</span>
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={handleSMS}
              className="flex-col h-auto py-2.5 gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-bold">Gửi SMS</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
