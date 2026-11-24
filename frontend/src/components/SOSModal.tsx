import React, { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, Send, UserPlus, Trash2, ShieldAlert, HeartHandshake } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className={`w-full max-w-lg border-slate-200 shadow-2xl bg-white rounded-3xl overflow-hidden ${isElderMode ? 'text-xl' : 'text-base'}`}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-rose-50/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className={`font-black text-rose-950 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
                Hỏi Ý Kiến Người Thân (SOS)
              </CardTitle>
              <p className="text-xs text-rose-800 font-medium">Bình tĩnh, không chuyển tiền vội. Hãy hỏi con cháu trước!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Reassuring Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Kẻ xấu thường hối thúc để bạn không kịp hỏi ai. Chỉ cần dừng lại 1 phút hỏi con cháu là an toàn!</span>
          </div>

          {/* Contact Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chọn người thân muốn liên lạc:
              </label>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
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
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{c.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {c.relationship}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-medium">{c.phone}</div>
                      </div>
                    </div>

                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteContact(c.phone)
                        }}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Form thêm số mới */}
            {showAddForm && (
              <form onSubmit={handleAddContact} className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700">Lưu số con cháu vào danh bạ an toàn:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Tên (VD: Con trai Nam)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Lưu số này
                </Button>
              </form>
            )}
          </div>

          {/* Pre-written Message Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Nội dung gửi cho con cháu:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              &quot;{messageText}&quot;
            </p>
          </div>

          {/* Quick Actions (Call, SMS, Zalo) */}
          <div className="grid grid-cols-3 gap-2.5">
            <Button
              type="button"
              onClick={handleCall}
              disabled={!selectedPhone}
              className="font-bold py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex flex-col items-center justify-center gap-1 h-auto"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Gọi điện ngay</span>
            </Button>

            <Button
              type="button"
              onClick={handleSMS}
              disabled={!selectedPhone}
              className="font-bold py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex flex-col items-center justify-center gap-1 h-auto"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">Gửi SMS</span>
            </Button>

            <Button
              type="button"
              onClick={handleZalo}
              disabled={!selectedPhone}
              className="font-bold py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex flex-col items-center justify-center gap-1 h-auto"
            >
              <Send className="w-5 h-5" />
              <span className="text-xs">Gửi qua Zalo</span>
            </Button>
          </div>

          {/* Hotline khẩn cấp Công an */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Hoặc gọi trực ban Công an Đồng Nai:</span>
            <a href="tel:0693480113" className="font-bold text-rose-600 hover:underline">
              0693.480.113
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
