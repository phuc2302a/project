import React, { useState, useEffect } from 'react'
import { BarChart3, FileText, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'
import type { VolunteerStats } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'

export const VolunteerScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [stats, setStats] = useState<VolunteerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const data = await api.getVolunteerStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-800 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                Tuyên truyền cấp Xã / Phường
              </span>
              <span className="text-xs text-blue-200">Đồng Nai 2026</span>
            </div>
            <h1 className={`mt-2 font-black tracking-tight ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
              Dashboard Đội Thanh Niên Tình Nguyện
            </h1>
            <p className={`mt-1 text-blue-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
              Thống kê các kiểu lừa đảo mới phát sinh tại địa phương nhằm phục vụ công tác tuyên truyền trực tiếp.
            </p>
          </div>
        </div>
      </div>

      {loading || !stats ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu địa phương...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* THỐNG KÊ CỐT LÕI (DỮ LIỆU ĐỀ BÀI) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase">Tổng lượt báo cáo trong tháng</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900">{stats.total_reports_month}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  +18% so với tháng trước
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Người dân xã/phường gửi về</p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm border-l-4 border-l-red-500">
              <p className="text-sm font-bold text-gray-500 uppercase">Đường dẫn giả mạo (Phishing)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-red-600">{stats.fake_links_percentage}%</span>
                <span className="text-xs text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded">
                  {stats.summary_by_category.fake_link} vụ việc
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Tỷ lệ chiếm cao nhất hiện nay</p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm border-l-4 border-l-amber-500">
              <p className="text-sm font-bold text-gray-500 uppercase">Cuộc gọi mạo danh Công an</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-600">{stats.phone_scams_percentage}%</span>
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                  {stats.summary_by_category.impersonation_police} vụ việc
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Nhắm chủ yếu vào người 65 tuổi</p>
            </div>
          </div>

          {/* BIỂU ĐỒ THANH PHẦN TRĂM CÁC THỦ ĐOẠN */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Cơ cấu các kiểu lừa đảo nổi cộm tại địa bàn
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>1. Đường dẫn website giả mạo (Ngân hàng, Dịch vụ công)</span>
                  <span className="text-red-600 font-bold">{stats.fake_links_percentage}% (42 vụ)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.fake_links_percentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>2. Cuộc gọi giả danh cơ quan Công an, Viện kiểm sát</span>
                  <span className="text-amber-600 font-bold">{stats.phone_scams_percentage}% (36 vụ)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.phone_scams_percentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>3. Tuyển cộng tác viên đặt đơn 'việc nhẹ lương cao'</span>
                  <span className="text-blue-600 font-bold">20% (24 vụ)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>4. Tin nhắn báo người thân tai nạn cần chuyển tiền gấp</span>
                  <span className="text-purple-600 font-bold">15% (18 vụ)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* DANH SÁCH BÁO CÁO MỚI NHẤT & MÃ HỒ SƠ CÔNG AN */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Các vụ việc mới nhất đã chuyển giao xác minh
              </h3>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
                Cập nhật theo thời gian thực
              </span>
            </div>

            <div className="space-y-3">
              {stats.recent_reports.map((report) => (
                <div key={report.id} className="rounded-xl border p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                        {report.id}
                      </span>
                      <span className="font-bold text-gray-900">{report.tactic_type}</span>
                    </div>

                    {report.police_case_code && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        {report.police_case_code}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                  
                  <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t">
                    <span className="font-mono text-red-600 font-semibold">Đối tượng: {report.target}</span>
                    <span>Thời gian: {new Date(report.reported_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
